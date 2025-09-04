import React, { useState, useEffect } from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, Search, Filter, ChevronDown, ExternalLink, Mail, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchOrders, type OrderData } from '@/services/googleSheets';
import { useToast } from '@/hooks/use-toast';

const LogisticsOrderProcessing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('delivery_date');
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const breadcrumbs = [
    { label: 'Supply Chain' },
    { label: 'Logistics Order Processing' }
  ];

  // Fetch data from Google Sheets on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
      toast({
        title: "Data Updated",
        description: `Loaded ${data.length} orders from Google Sheets`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => 
      order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sku_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'delivery_date':
          return new Date(a.expected_delivery_date).getTime() - new Date(b.expected_delivery_date).getTime();
        case 'po_number':
          return a.po_number.localeCompare(b.po_number);
        case 'quantity':
          return b.quantity - a.quantity;
        case 'sku_id':
          return a.sku_id.localeCompare(b.sku_id);
        default:
          return 0;
      }
    });

  const googleSheetUrl = "https://docs.google.com/spreadsheets/d/1YusTkKbZESXfhF4XVV4_escOJZDWdicUoN7fsRqTj5A/edit?pli=1&gid=0#gid=0";

  return (
    <MicroserviceShell
      title="Logistics Order Processing Agent"
      description="An autonomous agent that monitors inbound orders, parses details, and seamlessly syncs them for operational visibility."
      icon={Truck}
      breadcrumbs={breadcrumbs}
      metadata={{
        title: 'Logistics Order Processing Agent - Order Monitoring',
        description: 'Autonomous agent for monitoring inbound orders and operational visibility'
      }}
    >
      <div className="space-y-6">
        {/* Status Badges */}
        <div className="flex gap-2">
          <Badge variant="secondary">Autonomous Agent</Badge>
          <Badge variant="secondary">Order Monitoring</Badge>
          <Badge variant="secondary">Real-time Sync</Badge>
        </div>

        {/* Alert Notice */}
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-medium text-orange-900 dark:text-orange-100">🚨 Please Note</h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  To test this workflow: Send an email to <strong>request.purchase.order1@gmail.com</strong> in the required format.
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  The AI Agent will extract PO details and push them into this dashboard.
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  You can deep dive into the raw sheet if needed.
                </p>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(googleSheetUrl, '_blank')}
                    className="bg-white/50 hover:bg-white/80 border-orange-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    👉 View Full Google Sheet
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Sheets Embed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Live Order Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border/20 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <iframe
                src={`${googleSheetUrl}&rm=minimal`}
                className="w-full h-full border-0"
                title="Live Order Processing Sheet"
                allow="fullscreen"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Live Table Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Live Order Table
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadOrders}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search PO numbers or SKUs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery_date">Delivery Date</SelectItem>
                  <SelectItem value="po_number">PO Number</SelectItem>
                  <SelectItem value="quantity">Quantity</SelectItem>
                  <SelectItem value="sku_id">SKU ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Expected Delivery Date</TableHead>
                    <TableHead>SKU ID</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        {orders.length === 0 ? 'No orders found' : 'No orders match your search criteria'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{order.po_number}</TableCell>
                        <TableCell>{order.expected_delivery_date}</TableCell>
                        <TableCell>{order.sku_id}</TableCell>
                        <TableCell>{order.quantity.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Example Email Section */}
        <Collapsible open={isExampleOpen} onOpenChange={setIsExampleOpen}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    📧 Example Email Format
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isExampleOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Subject:</h4>
                    <p className="text-sm bg-muted p-3 rounded-md font-mono">
                      Inbound Order PO45231 – Expected Delivery on 2025-03-27
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Body:</h4>
                    <div className="text-sm bg-muted p-4 rounded-md font-mono space-y-2">
                      <p>Dear Procurement Team,</p>
                      <p></p>
                      <p>Please find the purchase order details below:</p>
                      <p></p>
                      <p>PO Number: PO45231</p>
                      <p>Expected Delivery: 2025-03-27</p>
                      <p></p>
                      <p>Order Lines:</p>
                      <p>- SKU: SKU-001-XYZ, Quantity: 500</p>
                      <p>- SKU: SKU-002-ABC, Quantity: 250</p>
                      <p></p>
                      <p>Please confirm receipt and processing.</p>
                      <p></p>
                      <p>Best regards,</p>
                      <p>Supplier Team</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This will help anyone new to the system test it right away.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={loadOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button onClick={() => {
            const csvContent = [
              ['PO Number', 'Expected Delivery Date', 'SKU ID', 'Quantity'],
              ...filteredOrders.map(order => [order.po_number, order.expected_delivery_date, order.sku_id, order.quantity])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}>
            Export Report
          </Button>
        </div>
      </div>
    </MicroserviceShell>
  );
};

export default LogisticsOrderProcessing;