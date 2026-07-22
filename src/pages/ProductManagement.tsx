import React, { useState, useEffect } from 'react';
import { Product, ProductStatus } from '../types';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { 
  Button, 
  Input, 
  Select, 
  Modal, 
  Drawer, 
  StatusBadge, 
  Pagination, 
  EmptyState, 
  Skeleton, 
  ConfirmationDialog,
  TimelineItem 
} from '../components/common/UIComponents';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Warehouse, 
  Tag, 
  DollarSign, 
  Layers, 
  Image as ImageIcon,
  History,
  TrendingUp,
  Inbox
} from 'lucide-react';

export default function ProductManagement() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals & drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productMovements, setProductMovements] = useState<any[]>([]);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSKU, setFormSKU] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formMinStock, setFormMinStock] = useState(0);
  const [formWarehouse, setFormWarehouse] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formStatus, setFormStatus] = useState<ProductStatus>('Active');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Stock Adjustment Form states
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (e) {
      toast('Failed to fetch products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMovements = async (productId: string) => {
    try {
      const allMovements = await inventoryService.getMovements();
      const filtered = allMovements.filter((m) => m.productId === productId);
      setProductMovements(filtered);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSKU('');
    setFormCategory('Electronics');
    setFormPrice(0);
    setFormStock(0);
    setFormMinStock(0);
    setFormWarehouse('Alpha Warehouse (Rack A1)');
    setFormImage('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200');
    setFormStatus('Active');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSKU(p.sku);
    setFormCategory(p.category);
    setFormPrice(p.unitPrice);
    setFormStock(p.currentStock);
    setFormMinStock(p.minStock);
    setFormWarehouse(p.warehouse);
    setFormImage(p.image || '');
    setFormStatus(p.status);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleOpenDetail = async (p: Product) => {
    setSelectedProduct(p);
    setIsDetailOpen(true);
    await loadMovements(p.id);
  };

  const handleOpenStockAdjust = (p: Product) => {
    setSelectedProduct(p);
    setAdjustType('IN');
    setAdjustQty(1);
    setAdjustReason('Stock count adjustment');
    setIsStockModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = 'Product name is required.';
    if (!formSKU.trim()) errors.sku = 'SKU identifier is required.';
    if (!formCategory.trim()) errors.category = 'Category is required.';
    if (formPrice <= 0) errors.price = 'Price must be greater than 0.';
    if (formStock < 0) errors.stock = 'Initial stock cannot be negative.';
    if (formMinStock < 0) errors.minStock = 'Alert limit cannot be negative.';
    if (!formWarehouse.trim()) errors.warehouse = 'Warehouse rack is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formName,
      sku: formSKU,
      category: formCategory,
      unitPrice: formPrice,
      currentStock: formStock,
      minStock: formMinStock,
      warehouse: formWarehouse,
      image: formImage || undefined,
      status: formStatus,
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        toast('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        toast('Product added to catalog!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (e) {
      toast('Failed to save product.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await productService.deleteProduct(deletingId);
      toast('Product archived from catalog!');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchProducts();
      if (selectedProduct?.id === deletingId) {
        setIsDetailOpen(false);
      }
    } catch (e) {
      toast('Failed to delete product.', 'error');
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const userRef = user ? `${user.name} (${user.role})` : 'Warehouse Staff';
      await inventoryService.addMovement(
        selectedProduct.id,
        adjustType,
        adjustQty,
        adjustReason || 'Manual adjustment',
        userRef
      );
      toast(`Adjusted stock by ${adjustType === 'IN' ? '+' : '-'}${adjustQty} successfully!`);
      setIsStockModalOpen(false);
      fetchProducts();
      // Reload movements if details drawer is open
      if (isDetailOpen && selectedProduct) {
        const updated = await productService.getProductById(selectedProduct.id);
        if (updated) setSelectedProduct(updated);
        loadMovements(selectedProduct.id);
      }
    } catch (err: any) {
      toast(err.message || 'Failed to adjust stock.', 'error');
    }
  };

  // Filters logic
  const filteredProducts = products.filter((p) => {
    const matchSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase());
    
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    
    let matchStock = true;
    if (stockFilter === 'Low Stock') {
      matchStock = p.currentStock > 0 && p.currentStock < p.minStock;
    } else if (stockFilter === 'Out of Stock') {
      matchStock = p.currentStock === 0;
    } else if (stockFilter === 'In Stock') {
      matchStock = p.currentStock >= p.minStock;
    }

    return matchSearch && matchCategory && matchStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Product Management</h1>
          <p className="text-xs text-muted-foreground">Maintain SKU inventories, wholesale price points, and logistics racking.</p>
        </div>
        <Button onClick={handleOpenAdd} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4 shadow-sm select-none">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            placeholder="Search name, SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-border dark:border-zinc-800 rounded-lg bg-[#FCFCFD] dark:bg-[#1E2228] text-foreground placeholder-muted-foreground/45 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Category select */}
        <Select
          options={[
            { value: 'All', label: 'All Categories' },
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Machinery', label: 'Machinery' },
            { value: 'Hardware', label: 'Hardware' }
          ]}
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
        />

        {/* Stock status filter */}
        <Select
          options={[
            { value: 'All', label: 'All Inventory Levels' },
            { value: 'In Stock', label: 'Healthy Stock' },
            { value: 'Low Stock', label: 'Low Stock Alerts' },
            { value: 'Out of Stock', label: 'Out Of Stock' }
          ]}
          value={stockFilter}
          onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Main Table view */}
      <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-12">
            <EmptyState message="No inventory items found matching select parameters." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#FCFCFD] dark:bg-zinc-800/40 border-b border-border dark:border-zinc-800 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Image</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">SKU Code</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4 text-center">Stock Count</th>
                  <th className="py-3.5 px-4 text-center">Min Alert Limit</th>
                  <th className="py-3.5 px-4">Warehouse Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-zinc-800/80 text-foreground dark:text-zinc-300">
                {paginatedProducts.map((p) => {
                  const isLow = p.currentStock > 0 && p.currentStock < p.minStock;
                  const isOut = p.currentStock === 0;
                  return (
                    <tr key={p.id} className="hover:bg-secondary/20 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="py-3 px-5">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary border border-border flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground dark:text-white">{p.name}</td>
                      <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground">{p.sku}</td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4 font-semibold font-mono">₹{p.unitPrice.toFixed(2)}</td>
                      <td className={`py-3 px-4 text-center font-bold font-mono ${
                        isOut ? 'text-[#E03131]' : isLow ? 'text-[#FF6B00]' : 'text-[#099268]'
                      }`}>
                        {p.currentStock}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-muted-foreground">{p.minStock}</td>
                      <td className="py-3 px-4 truncate max-w-[150px]">{p.warehouse}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenStockAdjust(p)}
                            title="Adjust Stock Quantity"
                            className="p-1.5 text-muted-foreground hover:text-accent hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDetail(p)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(p.id)}
                            className="p-1.5 text-muted-foreground hover:text-[#E03131] hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-5 py-4 bg-[#FCFCFD] dark:bg-zinc-800/20 border-t border-border dark:border-zinc-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Modify Product Details" : "Add New SKU Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="e.g. Industrial Controller IC-50"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            error={formErrors.name}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU Code Identifier"
              placeholder="e.g. IC-50-CTRL"
              value={formSKU}
              onChange={(e) => setFormSKU(e.target.value)}
              error={formErrors.sku}
              required
            />
            <Select
              label="Category"
              options={[
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Machinery', label: 'Machinery' },
                { value: 'Hardware', label: 'Hardware' }
              ]}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Wholesale Price (₹)"
              type="number"
              step="0.01"
              value={formPrice}
              onChange={(e) => setFormPrice(Number(e.target.value))}
              error={formErrors.price}
              required
            />
            <Input
              label="Current Stock"
              type="number"
              value={formStock}
              onChange={(e) => setFormStock(Number(e.target.value))}
              error={formErrors.stock}
              required
              disabled={!!editingProduct} // Disable direct stock manipulation in edit; force adjustment timeline logs instead
            />
            <Input
              label="Min Alert Limit"
              type="number"
              value={formMinStock}
              onChange={(e) => setFormMinStock(Number(e.target.value))}
              error={formErrors.minStock}
              required
            />
          </div>

          <Input
            label="Warehouse Storage Rack location"
            placeholder="e.g. Alpha Warehouse (Rack A1)"
            value={formWarehouse}
            onChange={(e) => setFormWarehouse(e.target.value)}
            error={formErrors.warehouse}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Product Image URL"
              placeholder="e.g. Unsplash URL"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
            />
            <Select
              label="Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? "Update Catalog SKU" : "Register Product"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        title={`Adjust Stock: ${selectedProduct?.name}`}
      >
        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Adjustment Mode"
              options={[
                { value: 'IN', label: 'Restock / Increase (IN)' },
                { value: 'OUT', label: 'Dispatch / Decrease (OUT)' }
              ]}
              value={adjustType}
              onChange={(e) => setAdjustType(e.target.value as 'IN' | 'OUT')}
            />
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={adjustQty}
              onChange={(e) => setAdjustQty(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Audit adjustment reason"
            placeholder="e.g. Purchase order dispatch or damage write-off..."
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setIsStockModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Apply Stock Adjustment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Product Detail drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedProduct?.name || 'Product Details'}
      >
        {selectedProduct && (
          <div className="space-y-6">
            
            {/* Image Preview Block */}
            <div className="relative h-48 w-full bg-secondary border border-border dark:border-zinc-800 rounded-xl overflow-hidden shadow-inner">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span>No preview image loaded</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <StatusBadge status={selectedProduct.status} />
              </div>
            </div>

            {/* SKU and details list */}
            <div className="grid grid-cols-2 gap-4 bg-[#F8F9FA] dark:bg-black/10 p-3.5 border border-border dark:border-zinc-800/80 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted-foreground uppercase font-semibold">SKU Identifier</span>
                <p className="text-xs font-bold text-foreground font-mono truncate">{selectedProduct.sku}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted-foreground uppercase font-semibold">Unit Price (₹)</span>
                <p className="text-xs font-bold text-foreground font-mono">₹{selectedProduct.unitPrice.toFixed(2)}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted-foreground uppercase font-semibold">Warehouse location</span>
                <p className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Warehouse className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{selectedProduct.warehouse.split(' (')[0]}</span>
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted-foreground uppercase font-semibold">Category</span>
                <p className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span>{selectedProduct.category}</span>
                </p>
              </div>
            </div>

            {/* Stock Level status card */}
            <div className="border border-border dark:border-zinc-800 rounded-xl p-4 space-y-3.5">
              <div className="flex justify-between items-center border-b border-border dark:border-zinc-800 pb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Inventory Status</span>
                <StatusBadge status={selectedProduct.currentStock === 0 ? 'Out of Stock' : selectedProduct.currentStock < selectedProduct.minStock ? 'Low Stock' : 'Active'} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-center select-none">
                <div className="p-2 bg-secondary/30 dark:bg-zinc-800/40 rounded-lg">
                  <span className="text-[8px] text-muted-foreground uppercase font-semibold">Current Count</span>
                  <p className="text-lg font-black text-foreground font-mono">{selectedProduct.currentStock}</p>
                </div>
                <div className="p-2 bg-secondary/30 dark:bg-zinc-800/40 rounded-lg">
                  <span className="text-[8px] text-muted-foreground uppercase font-semibold">Min Alert Trigger</span>
                  <p className="text-lg font-black text-foreground font-mono">{selectedProduct.minStock}</p>
                </div>
              </div>
            </div>

            {/* Stock Movement History ledger */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-border dark:border-zinc-800 pb-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Audit Movement Logs</span>
                </span>
              </div>
              {productMovements.length === 0 ? (
                <div className="p-6 bg-secondary/10 text-center rounded-lg text-[10px] text-muted-foreground">
                  <Inbox className="w-5 h-5 mx-auto mb-1 opacity-50" />
                  <span>No stock transactions recorded for this SKU.</span>
                </div>
              ) : (
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {productMovements.map((move) => (
                    <div 
                      key={move.id} 
                      className="p-2.5 bg-secondary/25 dark:bg-[#1E2228]/45 border border-border dark:border-zinc-800/60 rounded-lg text-[10px] space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className={`px-1.5 py-0.2 rounded font-bold ${
                          move.type === 'IN' ? 'bg-[#E6FCF5] text-[#099268]' : 'bg-[#FFF5F5] text-[#E03131]'
                        }`}>
                          {move.type} ({move.quantity} units)
                        </span>
                        <span className="font-mono text-[8px] text-muted-foreground">
                          {new Date(move.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground font-medium">{move.reason}</p>
                      <p className="text-muted-foreground text-[8px]">Logged by: {move.createdBy}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions footer */}
            <div className="pt-4 border-t border-border dark:border-zinc-800 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => handleOpenEdit(selectedProduct)}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Catalog SKU</span>
              </Button>
              <Button 
                variant="danger" 
                className="flex-1" 
                onClick={() => handleOpenDelete(selectedProduct.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Archive</span>
              </Button>
            </div>

          </div>
        )}
      </Drawer>

      {/* Delete confirm dialog */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        title="Archive Product"
        message="Are you sure you want to permanently delete this SKU from the catalog? This will remove all local visibility profiles."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
        isDanger
      />

    </div>
  );
}
