"use client"

import { useState } from "react"
import FileUpload from "@/components/file-upload"
import DocumentList from "@/components/document-list"
import { myUploads, purchasedDocuments, mockUser } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react"
import { format } from "date-fns"

export default function Dashboard() {
  const [user] = useState(mockUser)
  const [uploads] = useState(myUploads)
  const [purchased] = useState(purchasedDocuments)

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your health datasets and transactions.</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-emerald-600">${user.balance.toFixed(2)}</span>
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">
                  $
                  {user.transactions
                    .filter((t) => t.type === "sale")
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">
                  $
                  {user.transactions
                    .filter((t) => t.type === "purchase")
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </span>
              </div>
              <ArrowDownLeft className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <FileUpload />
      </div>

      <Tabs defaultValue="my-data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-data">My Datasets</TabsTrigger>
          <TabsTrigger value="purchased">Purchased Datasets</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="my-data" className="space-y-4">
          <h2 className="text-xl font-semibold">My Uploaded Datasets</h2>
          <DocumentList documents={uploads} showBuyButton={false} />
        </TabsContent>

        <TabsContent value="purchased" className="space-y-4">
          <h2 className="text-xl font-semibold">Purchased Datasets</h2>
          <DocumentList documents={purchased} showBuyButton={false} />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 border-b bg-muted/50 p-4 font-medium">
              <div>Date</div>
              <div className="col-span-2">Dataset</div>
              <div className="text-right">Amount</div>
            </div>
            <div className="divide-y">
              {user.transactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-4 p-4">
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </div>
                  <div className="col-span-2 text-sm">
                    {transaction.documentName}
                    <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {transaction.type === "sale" ? "Sold" : "Purchased"}
                    </span>
                  </div>
                  <div
                    className={`text-right text-sm font-medium ${transaction.type === "sale" ? "text-emerald-600" : "text-blue-600"}`}
                  >
                    {transaction.type === "sale" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
