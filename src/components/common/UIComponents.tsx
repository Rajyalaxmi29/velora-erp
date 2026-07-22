import React from 'react';
import { X, ChevronLeft, ChevronRight, AlertCircle, AlertTriangle } from 'lucide-react';

// ==========================================
// BUTTON
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-4 py-2 text-xs font-semibold rounded-lg transition-all active:scale-98 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-95 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40",
    danger: "bg-[#E03131] text-white hover:bg-[#C92A2A] shadow-sm",
    outline: "bg-transparent border border-border hover:bg-secondary text-foreground"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : null}
      {children}
    </button>
  );
};

// ==========================================
// INPUT
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-[10px] font-semibold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 text-xs border border-border dark:border-zinc-800 rounded-lg bg-white dark:bg-[#1E2228] text-foreground placeholder-muted-foreground/45 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-[#E03131] font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

// ==========================================
// SELECT
// ==========================================
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ 
  label, 
  options, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-[10px] font-semibold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-3 py-2 text-xs border border-border dark:border-zinc-800 rounded-lg bg-white dark:bg-[#1E2228] text-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-[#E03131] font-medium">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

// ==========================================
// MODAL
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Content wrapper */}
      <div className="relative bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800/80 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Title bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-zinc-800">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-zinc-800 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// DRAWER
// ==========================================
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in" 
        onClick={onClose} 
      />

      {/* Content Slider */}
      <div className="relative bg-white dark:bg-[#15181C] border-l border-border dark:border-zinc-800/80 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-zinc-800">
          <h3 className="text-sm font-bold text-foreground truncate">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-zinc-800 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STATUS BADGE
// ==========================================
interface BadgeProps {
  status: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeColors = (st: string) => {
    const term = st.toLowerCase();
    
    // CRM
    if (term === 'active' || term === 'completed' || term === 'in') {
      return 'bg-[#E6FCF5] text-[#099268] dark:bg-[#103024] dark:text-[#63E6BE]';
    }
    if (term === 'lead' || term === 'pending' || term === 'draft') {
      return 'bg-[#FFF9DB] text-[#F59F00] dark:bg-[#2A2415] dark:text-[#FFE3E3]';
    }
    if (term === 'inactive' || term === 'cancelled' || term === 'out') {
      return 'bg-[#FFF5F5] text-[#E03131] dark:bg-[#341818] dark:text-[#FFA8A8]';
    }
    if (term === 'confirmed') {
      return 'bg-[#E8F9FF] text-[#1C7ED6] dark:bg-[#142D4C] dark:text-[#74C0FC]';
    }
    if (term === 'wholesale' || term === 'distributor') {
      return 'bg-[#F4F2FF] text-[#5C2AF5] dark:bg-[#221C42] dark:text-[#B197FC]';
    }
    return 'bg-secondary text-foreground';
  };

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${getBadgeColors(status)}`}>
      {status}
    </span>
  );
};

// ==========================================
// PAGINATION
// ==========================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border dark:border-zinc-800/80 pt-4 select-none">
      <span className="text-[10px] text-muted-foreground font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 border border-border dark:border-zinc-800 rounded bg-white dark:bg-zinc-800 text-foreground hover:bg-secondary dark:hover:bg-zinc-700 disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 border border-border dark:border-zinc-800 rounded bg-white dark:bg-zinc-800 text-foreground hover:bg-secondary dark:hover:bg-zinc-700 disabled:opacity-40"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// EMPTY STATE
// ==========================================
interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border dark:border-zinc-800 rounded-xl text-center">
      <AlertCircle className="w-6 h-6 text-muted-foreground/75 mb-2" />
      <p className="text-xs text-muted-foreground font-medium">{message}</p>
    </div>
  );
};

// ==========================================
// SKELETON
// ==========================================
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`}></div>
  );
};

// ==========================================
// CONFIRMATION DIALOG
// ==========================================
interface ConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmProps> = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isDanger = false,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isDanger ? 'text-[#E03131]' : 'text-[#F59F00]'}`} />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{title}</h4>
            <p className="text-xs text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>Cancel</Button>
          <Button 
            variant={isDanger ? 'danger' : 'primary'} 
            onClick={onConfirm} 
            isLoading={isLoading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TIMELINE
// ==========================================
interface TimelineItemProps {
  title: string;
  description: string;
  meta: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ 
  title, 
  description, 
  meta, 
  icon,
  isActive = false
}) => {
  return (
    <div className="flex gap-3 relative pb-6 last:pb-0">
      {/* Node line */}
      <div className="absolute left-3 top-6 bottom-0 w-px bg-border dark:bg-zinc-800 last:hidden" />
      
      {/* Node circle */}
      <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border relative z-10 ${
        isActive 
          ? 'bg-accent border-accent text-white' 
          : 'bg-white dark:bg-zinc-800 border-border dark:border-zinc-700 text-muted-foreground'
      }`}>
        {icon || <span className="w-1.5 h-1.5 bg-current rounded-full"></span>}
      </div>

      {/* Item info */}
      <div className="space-y-1 flex-1">
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[11px] font-bold text-foreground">{title}</span>
          <span className="text-[9px] text-muted-foreground font-mono">{meta}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-normal">{description}</p>
      </div>
    </div>
  );
};
