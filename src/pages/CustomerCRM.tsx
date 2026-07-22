import React, { useState, useEffect } from 'react';
import { 
  Customer, 
  CustomerType, 
  CustomerStatus 
} from '../types';
import { customerService } from '../services/customerService';
import { useToast } from '../components/common/Toast';
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
  Calendar, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  FileSpreadsheet,
  Clock
} from 'lucide-react';

export default function CustomerCRM() {
  const { toast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'followUpDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal / Drawer states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBusiness, setFormBusiness] = useState('');
  const [formGST, setFormGST] = useState('');
  const [formType, setFormType] = useState<CustomerType>('Retail');
  const [formStatus, setFormStatus] = useState<CustomerStatus>('Lead');
  const [formAddress, setFormAddress] = useState('');
  const [formFollowUp, setFormFollowUp] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (e) {
      toast('Failed to load customers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormBusiness('');
    setFormGST('');
    setFormType('Retail');
    setFormStatus('Lead');
    setFormAddress('');
    setFormFollowUp(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormPhone(cust.phone);
    setFormEmail(cust.email);
    setFormBusiness(cust.businessName);
    setFormGST(cust.gstNumber || '');
    setFormType(cust.customerType);
    setFormStatus(cust.status);
    setFormAddress(cust.notes ? '' : ''); // Address mapped to notes or mock
    setFormFollowUp(cust.followUpDate);
    setFormNotes(cust.notes || '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = 'Customer name is required.';
    
    // Simple phone validator (numbers, spaces, dashes)
    const phoneRegex = /^[0-9+\-\s()]{6,15}$/;
    if (!formPhone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formPhone)) {
      errors.phone = 'Invalid phone number format.';
    }

    // Email validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formEmail)) {
      errors.email = 'Invalid email address format.';
    }

    if (!formBusiness.trim()) errors.business = 'Business name is required.';
    if (!formFollowUp) errors.followUp = 'Follow-up date is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formName,
      phone: formPhone,
      email: formEmail,
      businessName: formBusiness,
      gstNumber: formGST || undefined,
      customerType: formType,
      status: formStatus,
      followUpDate: formFollowUp,
      notes: formNotes || undefined,
    };

    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, payload);
        toast('Customer updated successfully!');
      } else {
        await customerService.createCustomer(payload);
        toast('Customer created successfully!');
      }
      setIsModalOpen(false);
      fetchCustomers();
      if (selectedCustomer?.id === editingCustomer?.id) {
        setSelectedCustomer(null);
        setIsDetailOpen(false);
      }
    } catch (e) {
      toast('Failed to save customer.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await customerService.deleteCustomer(deletingId);
      toast('Customer deleted successfully!');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchCustomers();
      if (selectedCustomer?.id === deletingId) {
        setSelectedCustomer(null);
        setIsDetailOpen(false);
      }
    } catch (e) {
      toast('Failed to delete customer.', 'error');
    }
  };

  const handleOpenDetail = (cust: Customer) => {
    setSelectedCustomer(cust);
    setIsDetailOpen(true);
  };

  // Filter & Sort Logic
  const filteredCustomers = customers
    .filter((c) => {
      const matchSearch = 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.businessName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      
      const matchType = typeFilter === 'All' || c.customerType === typeFilter;
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc' 
          ? a.followUpDate.localeCompare(b.followUpDate) 
          : b.followUpDate.localeCompare(a.followUpDate);
      }
    });

  // Paginated List
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const triggerSort = (field: 'name' | 'followUpDate') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Customer CRM</h1>
          <p className="text-xs text-muted-foreground">Manage client credentials, categories, and audit communications.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Filter grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4 shadow-sm select-none">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            placeholder="Search name, company, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-border dark:border-zinc-800 rounded-lg bg-[#FCFCFD] dark:bg-[#1E2228] text-foreground placeholder-muted-foreground/45 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Type Filter */}
        <Select
          options={[
            { value: 'All', label: 'All Customer Types' },
            { value: 'Retail', label: 'Retail' },
            { value: 'Wholesale', label: 'Wholesale' },
            { value: 'Distributor', label: 'Distributor' },
          ]}
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
        />

        {/* Status Filter */}
        <Select
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Lead', label: 'Lead' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        />

        {/* Sorting Toggler Display */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => triggerSort('name')} 
            className="flex-1 text-[10px] py-1.5"
          >
            Sort Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => triggerSort('followUpDate')} 
            className="flex-1 text-[10px] py-1.5"
          >
            Sort Follow-up {sortBy === 'followUpDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </Button>
        </div>
      </div>

      {/* Main CRM Table list */}
      <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : paginatedCustomers.length === 0 ? (
          <div className="p-12">
            <EmptyState message="No customer credentials matching filter criteria were found." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#FCFCFD] dark:bg-zinc-800/40 border-b border-border dark:border-zinc-800 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Customer Name</th>
                  <th className="py-3.5 px-4">Business Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Customer Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Follow-up Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-zinc-800/80 text-foreground dark:text-zinc-300">
                {paginatedCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-secondary/20 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-5 font-semibold text-foreground dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-foreground dark:text-zinc-200">
                        {cust.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span>{cust.name}</span>
                    </td>
                    <td className="py-3 px-4">{cust.businessName}</td>
                    <td className="py-3 px-4 font-mono text-[10px]">{cust.phone}</td>
                    <td className="py-3 px-4 font-mono text-[10px] truncate max-w-[150px]">{cust.email}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cust.customerType} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cust.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{cust.followUpDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(cust)}
                          className="p-1.5 text-muted-foreground hover:text-accent hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(cust)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(cust.id)}
                          className="p-1.5 text-muted-foreground hover:text-[#E03131] hover:bg-secondary dark:hover:bg-zinc-800 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        <div className="px-5 py-4 bg-[#FCFCFD] dark:bg-zinc-800/20 border-t border-border dark:border-zinc-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>

      {/* CRM Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Modify Customer Profile" : "Register New Customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Customer Name"
              placeholder="e.g. Robert Vance"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              error={formErrors.name}
              required
            />
            <Input
              label="Business Name"
              placeholder="e.g. Vance Refrigeration"
              value={formBusiness}
              onChange={(e) => setFormBusiness(e.target.value)}
              error={formErrors.business}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Mobile Number"
              placeholder="e.g. 555-0144"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              error={formErrors.phone}
              required
            />
            <Input
              label="Email Address"
              placeholder="e.g. vance@refrigeration.com"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              error={formErrors.email}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="GST Number (Optional)"
              placeholder="e.g. 27AAAAA1111A1Z1"
              value={formGST}
              onChange={(e) => setFormGST(e.target.value)}
            />
            <Select
              label="Customer Type"
              options={[
                { value: 'Retail', label: 'Retail' },
                { value: 'Wholesale', label: 'Wholesale' },
                { value: 'Distributor', label: 'Distributor' },
              ]}
              value={formType}
              onChange={(e) => setFormType(e.target.value as CustomerType)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Workflow Status"
              options={[
                { value: 'Lead', label: 'Lead' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as CustomerStatus)}
            />
            <Input
              label="Next Follow-up Date"
              type="date"
              value={formFollowUp}
              onChange={(e) => setFormFollowUp(e.target.value)}
              error={formErrors.followUp}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Profile Notes / Address Summary
            </label>
            <textarea
              rows={3}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Provide delivery schedules, contact logs, or regional notes..."
              className="w-full px-3 py-2 text-xs border border-border dark:border-zinc-800 rounded-lg bg-white dark:bg-[#1E2228] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCustomer ? "Update Profile" : "Register Customer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer Detail Slide Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedCustomer?.name || 'Customer Details'}
      >
        {selectedCustomer && (
          <div className="space-y-6">
            
            {/* Main Profile Header card */}
            <div className="bg-secondary/35 dark:bg-[#1C2025] rounded-xl p-4 border border-border dark:border-zinc-800/80 text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <StatusBadge status={selectedCustomer.status} />
              </div>
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mx-auto">
                {selectedCustomer.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{selectedCustomer.name}</h4>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{selectedCustomer.customerType} Client</p>
              </div>
            </div>

            {/* Corporate ledger grid */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/80 dark:border-zinc-800 pb-1">
                Business & Compliance Information
              </h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs">
                  <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground">Corporate Business Entity</p>
                    <p className="font-semibold text-foreground">{selectedCustomer.businessName}</p>
                  </div>
                </div>
                {selectedCustomer.gstNumber && (
                  <div className="flex items-center gap-2.5 text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-[9px] text-muted-foreground">GST Compliance Registration</p>
                      <p className="font-semibold text-foreground font-mono">{selectedCustomer.gstNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information card */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/80 dark:border-zinc-800 pb-1">
                Contact Ledger
              </h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground">Registered Phone</p>
                    <p className="font-semibold text-foreground font-mono">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground">Corporate Email</p>
                    <p className="font-semibold text-foreground font-mono">{selectedCustomer.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timelines and Schedule follow-ups */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/80 dark:border-zinc-800 pb-1">
                Timeline & Next Actions
              </h5>
              <div className="bg-secondary/20 dark:bg-black/10 rounded-lg p-3 space-y-4">
                <div className="flex items-start gap-2.5 text-xs">
                  <Clock className="w-4 h-4 text-accent mt-0.5" />
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Scheduled Follow-up</p>
                    <p className="font-bold text-foreground font-mono mt-0.5">{selectedCustomer.followUpDate}</p>
                  </div>
                </div>
                {selectedCustomer.notes && (
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Latest Profile Notes</p>
                    <p className="text-xs text-foreground mt-1 bg-white dark:bg-[#1E2228] p-2 border border-border dark:border-zinc-800/80 rounded leading-relaxed">
                      {selectedCustomer.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Detail Drawer Actions footer */}
            <div className="pt-6 border-t border-border dark:border-zinc-800/80 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => handleOpenEditModal(selectedCustomer)}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Button>
              <Button 
                variant="danger" 
                className="flex-1" 
                onClick={() => handleOpenDelete(selectedCustomer.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
            </div>

          </div>
        )}
      </Drawer>

      {/* Delete confirmation popup */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        title="Confirm Customer Deletion"
        message="Are you sure you want to permanently delete this customer from the Velora database? All linked logs will be archived."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
        isDanger
      />

    </div>
  );
}
