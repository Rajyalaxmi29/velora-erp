import React, { useState, useEffect } from 'react';
import { SalesChallan, ChallanStatus, SalesChallanItem } from '../types';
import { challanService } from '../services/challanService';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';
import { Customer, Product } from '../types';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import {
  Button,
  Select,
  Modal,
  Drawer,
  StatusBadge,
  Pagination,
  EmptyState,
  Skeleton,
  ConfirmationDialog,
} from '../components/common/UIComponents';
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Printer,
  Package,
  X,
  ChevronDown,
} from 'lucide-react';

export default function SalesChallans() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [challans, setChallans] = useState<SalesChallan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<SalesChallan | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form
  const [formCustomerId, setFormCustomerId] = useState('');
  const [formStatus, setFormStatus] = useState<ChallanStatus>('Draft');
  const [formItems, setFormItems] = useState<SalesChallanItem[]>([
    { productId: '', productName: '', quantity: 1, price: 0, subtotal: 0 },
  ]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [c, cu, p] = await Promise.all([
        challanService.getChallans(),
        customerService.getCustomers(),
        productService.getProducts(),
      ]);
      setChallans(c);
      setCustomers(cu);
      setProducts(p);
    } catch {
      toast('Failed to load challans.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ─── Item management ───────────────────────────────────
  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const updated = [...formItems];
    updated[index] = {
      ...updated[index],
      productId,
      productName: product.name,
      price: product.unitPrice,
      subtotal: product.unitPrice * updated[index].quantity,
    };
    setFormItems(updated);
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const updated = [...formItems];
    updated[index] = {
      ...updated[index],
      quantity: qty,
      subtotal: updated[index].price * qty,
    };
    setFormItems(updated);
  };

  const handleAddRow = () => {
    setFormItems([
      ...formItems,
      { productId: '', productName: '', quantity: 1, price: 0, subtotal: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (formItems.length === 1) return;
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const grandTotal = formItems.reduce((s, i) => s + i.subtotal, 0);
  const grandQuantity = formItems.reduce((s, i) => s + i.quantity, 0);

  // ─── Submit ────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerId) { toast('Please select a customer.', 'error'); return; }
    const validItems = formItems.filter((i) => i.productId);
    if (!validItems.length) { toast('Add at least one product.', 'error'); return; }

    const customer = customers.find((c) => c.id === formCustomerId);
    if (!customer) return;

    setIsSubmitting(true);
    try {
      await challanService.createChallan(
        {
          customerId: formCustomerId,
          customerName: customer.name,
          items: validItems,
          grandTotal,
          grandQuantity,
          status: formStatus,
        },
        user ? `${user.name} (${user.role})` : 'Sales Staff'
      );
      toast('Sales Challan created successfully!');
      setIsCreateOpen(false);
      fetchAll();
    } catch {
      toast('Failed to create challan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Status update ─────────────────────────────────────
  const handleStatusChange = async (id: string, newStatus: ChallanStatus) => {
    try {
      await challanService.updateChallanStatus(
        id,
        newStatus,
        user ? `${user.name} (${user.role})` : 'Staff'
      );
      toast(`Challan status updated to ${newStatus}.`);
      setIsConfirmOpen(false);
      fetchAll();
      if (selectedChallan?.id === id) {
        const updated = await challanService.getChallanById(id);
        setSelectedChallan(updated);
      }
    } catch {
      toast('Status update failed.', 'error');
    }
  };

  // ─── Filters ───────────────────────────────────────────
  const filtered = challans.filter((c) => {
    const matchSearch =
      c.challanNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openCreate = () => {
    setFormCustomerId('');
    setFormStatus('Draft');
    setFormItems([{ productId: '', productName: '', quantity: 1, price: 0, subtotal: 0 }]);
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Sales Challans</h1>
          <p className="text-xs text-muted-foreground">Issue, track, and confirm wholesale dispatch challans.</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Create Challan</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            placeholder="Search challan # or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-border dark:border-zinc-800 rounded-lg bg-[#FCFCFD] dark:bg-[#1E2228] text-foreground placeholder-muted-foreground/45 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <Select
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Draft', label: 'Draft' },
            { value: 'Confirmed', label: 'Confirmed' },
            { value: 'Cancelled', label: 'Cancelled' },
          ]}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        />
        <div className="flex gap-2 text-[10px] text-muted-foreground items-center pl-1">
          <span className="bg-[#E6FCF5] text-[#099268] px-2 py-1 rounded font-semibold">Confirmed stock deducts</span>
          <span className="bg-[#FFF9DB] text-[#F59F00] px-2 py-1 rounded font-semibold">Draft = no deduction</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-12">
            <EmptyState message="No challans matching current filters." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#FCFCFD] dark:bg-zinc-800/40 border-b border-border dark:border-zinc-800 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Challan #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4 text-center">Items</th>
                  <th className="py-3.5 px-4 text-center">Qty</th>
                  <th className="py-3.5 px-4 text-right">Grand Total</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-zinc-800/80">
                {paginated.map((ch) => (
                  <tr key={ch.id} className="hover:bg-secondary/20 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-5 font-mono font-bold text-foreground dark:text-white">{ch.challanNumber}</td>
                    <td className="py-3 px-4 text-foreground dark:text-zinc-300">{ch.customerName}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{ch.items.length}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-foreground">{ch.grandQuantity}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground dark:text-white">
                      ₹{ch.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground">{ch.createdDate}</td>
                    <td className="py-3 px-4"><StatusBadge status={ch.status} /></td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => { setSelectedChallan(ch); setIsDetailOpen(true); }}
                          className="p-1.5 text-muted-foreground hover:text-accent hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {ch.status === 'Draft' && (
                          <button
                            onClick={() => { setConfirmingId(ch.id); setIsConfirmOpen(true); }}
                            className="p-1.5 text-muted-foreground hover:text-[#099268] hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                            title="Confirm Challan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-4 bg-[#FCFCFD] dark:bg-zinc-800/20 border-t border-border dark:border-zinc-800">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Create Challan Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Sales Challan">
        <form onSubmit={handleCreate} className="space-y-5">
          {/* Customer dropdown */}
          <Select
            label="Select Customer"
            options={[
              { value: '', label: '— Choose a customer —' },
              ...customers.map((c) => ({ value: c.id, label: `${c.name} (${c.businessName})` })),
            ]}
            value={formCustomerId}
            onChange={(e) => setFormCustomerId(e.target.value)}
          />

          {/* Dynamic product rows */}
          <div className="space-y-2">
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Products
            </label>
            <div className="border border-border dark:border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-secondary/50 dark:bg-zinc-800/60 text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2 text-left">Product</th>
                    <th className="px-3 py-2 text-center w-20">Qty</th>
                    <th className="px-3 py-2 text-right w-24">Price</th>
                    <th className="px-3 py-2 text-right w-24">Subtotal</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-zinc-800">
                  {formItems.map((item, idx) => (
                    <tr key={idx} className="bg-white dark:bg-[#1A1E24]">
                      <td className="px-3 py-2">
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full text-xs border border-border dark:border-zinc-800 rounded bg-white dark:bg-[#1E2228] py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                          <option value="">— Select product —</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Stock: {p.currentStock})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                          className="w-full text-xs border border-border dark:border-zinc-800 rounded bg-white dark:bg-[#1E2228] py-1 px-2 text-center focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-foreground">
                        ₹{item.subtotal.toFixed(2)}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="text-muted-foreground hover:text-[#E03131] transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-secondary/30 dark:bg-zinc-800/40 border-t border-border dark:border-zinc-800">
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-[10px] font-bold text-muted-foreground">
                      Total: {grandQuantity} units
                    </td>
                    <td className="px-3 py-2 text-right text-[10px] font-bold text-muted-foreground">Grand Total</td>
                    <td className="px-3 py-2 text-right font-mono font-black text-foreground dark:text-white text-sm">
                      ₹{grandTotal.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <Button type="button" variant="ghost" onClick={handleAddRow} className="text-[10px] py-1">
              <Plus className="w-3 h-3" /> Add Product Row
            </Button>
          </div>

          {/* Status */}
          <Select
            label="Challan Status"
            options={[
              { value: 'Draft', label: 'Save as Draft' },
              { value: 'Confirmed', label: 'Confirm & Dispatch (deducts stock)' },
            ]}
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value as ChallanStatus)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>
              {formStatus === 'Draft' ? 'Save Draft' : 'Confirm & Dispatch'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Status Change */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Confirm Challan Dispatch"
        message="Confirming this challan will deduct the item quantities from inventory. This action cannot be undone."
        onConfirm={() => confirmingId && handleStatusChange(confirmingId, 'Confirmed')}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* Challan Detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedChallan ? `Challan ${selectedChallan.challanNumber}` : 'Challan Details'}
      >
        {selectedChallan && (
          <div className="space-y-5">
            {/* Header card */}
            <div className="bg-secondary/30 dark:bg-[#1C2025] rounded-xl p-4 border border-border dark:border-zinc-800/80 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-semibold">Challan Reference</p>
                  <p className="text-lg font-black font-mono text-foreground">{selectedChallan.challanNumber}</p>
                </div>
                <StatusBadge status={selectedChallan.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[9px] text-muted-foreground">Customer</p>
                  <p className="font-bold text-foreground">{selectedChallan.customerName}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground">Created Date</p>
                  <p className="font-bold font-mono text-foreground">{selectedChallan.createdDate}</p>
                </div>
              </div>
            </div>

            {/* Product table */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dispatched Products</p>
              <div className="border border-border dark:border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50 dark:bg-zinc-800/60 text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-center">Qty</th>
                      <th className="px-3 py-2 text-right">Unit Price</th>
                      <th className="px-3 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-zinc-800">
                    {selectedChallan.items.map((item, idx) => (
                      <tr key={idx} className="bg-white dark:bg-[#1A1E24]">
                        <td className="px-3 py-2.5 font-medium text-foreground dark:text-zinc-300">{item.productName}</td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold">{item.quantity}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">₹{item.price.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-foreground">₹{item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-secondary/30 dark:bg-zinc-800/40 border-t-2 border-border dark:border-zinc-700">
                    <tr>
                      <td className="px-3 py-3 font-bold text-[10px] text-muted-foreground">{selectedChallan.grandQuantity} units total</td>
                      <td colSpan={2} className="px-3 py-3 text-right font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Grand Total</td>
                      <td className="px-3 py-3 text-right font-black font-mono text-sm text-foreground dark:text-white">
                        ₹{selectedChallan.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border dark:border-zinc-800 space-y-2">
              {selectedChallan.status === 'Draft' && (
                <Button
                  className="w-full"
                  onClick={() => { setConfirmingId(selectedChallan.id); setIsConfirmOpen(true); }}
                >
                  Confirm & Dispatch (deducts stock)
                </Button>
              )}
              {selectedChallan.status !== 'Cancelled' && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => handleStatusChange(selectedChallan.id, 'Cancelled')}
                >
                  Cancel Challan
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.print()}
              >
                <Printer className="w-3.5 h-3.5" />
                Print Challan
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
