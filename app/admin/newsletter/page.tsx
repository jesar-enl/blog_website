import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import AdminNavigation from "@/components/admin-navigation"
import { getNewsletterSubscribers } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/blog"
import { Mail, Users } from "lucide-react"

export default async function AdminNewsletterPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session?.user.email).single()

  const subscribers = await getNewsletterSubscribers()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation adminName={adminUser?.name || "Admin"} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">Newsletter</h1>
          <p className="text-gray-600">Manage your newsletter subscribers and campaigns.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Subscribers</p>
                  <p className="text-3xl font-bold text-gray-900">{subscribers.length}</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-50">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Subscribers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {subscribers.filter((sub) => sub.is_active && sub.is_confirmed).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Confirmation</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {subscribers.filter((sub) => !sub.is_confirmed).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-amber-50">
                  <Mail className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscribers List */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold text-xl text-gray-900 mb-6">Subscribers</h2>

            <div className="space-y-4">
              {subscribers.map((subscriber: any) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {subscriber.name ? subscriber.name.charAt(0) : subscriber.email.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{subscriber.name || subscriber.email}</p>
                      {subscriber.name && <p className="text-sm text-gray-500">{subscriber.email}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge variant={subscriber.is_confirmed ? "default" : "secondary"}>
                      {subscriber.is_confirmed ? "Confirmed" : "Pending"}
                    </Badge>
                    <Badge variant={subscriber.is_active ? "default" : "destructive"}>
                      {subscriber.is_active ? "Active" : "Unsubscribed"}
                    </Badge>
                    <span className="text-sm text-gray-500">{formatDate(subscriber.subscribed_at)}</span>
                  </div>
                </div>
              ))}
            </div>

            {subscribers.length === 0 && (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">No subscribers yet</h3>
                <p className="text-gray-600">Newsletter subscribers will appear here when users sign up.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
