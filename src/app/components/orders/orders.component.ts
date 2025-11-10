import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedStatus: string = 'all';
  searchTerm: string = '';
  isLoading: boolean = true;
  isGeneratingInvoice: { [orderId: string]: boolean } = {};

  statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    // Simulate API call delay
    setTimeout(() => {
      this.orders = this.cartService.getOrders();
      this.filteredOrders = [...this.orders];
      this.isLoading = false;
    }, 1000);
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = this.selectedStatus === 'all' || order.status === this.selectedStatus;
      const matchesSearch = this.searchTerm === '' || 
        order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (order.customer.name && order.customer.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (order.customer.firstName && order.customer.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesStatus && matchesSearch;
    });
  }

  onStatusChange() {
    this.filterOrders();
  }

  onSearchChange() {
    this.filterOrders();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-confirmed';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'confirmed': return 'bi bi-check-circle';
      case 'processing': return 'bi bi-gear';
      case 'shipped': return 'bi bi-truck';
      case 'delivered': return 'bi bi-box-seam';
      case 'cancelled': return 'bi bi-x-circle';
      default: return 'bi bi-check-circle';
    }
  }

  getPaymentMethodIcon(method: string): string {
    switch (method) {
      case 'card': return 'bi bi-credit-card';
      case 'paypal': return 'bi bi-paypal';
      case 'cod': return 'bi bi-cash';
      default: return 'bi bi-wallet';
    }
  }

  deleteOrder(orderId: string) {
    Swal.fire({
      title: 'Delete Order?',
      text: 'This action cannot be undone. Are you sure you want to delete this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteOrder(orderId);
        this.loadOrders();
        
        Swal.fire(
          'Deleted!',
          'Your order has been deleted.',
          'success'
        );
      }
    });
  }

  trackOrder(order: any) {
    Swal.fire({
      title: 'Track Order',
      html: `
        <div class="tracking-info">
          <h4>Order #${order.id}</h4>
          <div class="tracking-steps">
            <div class="tracking-step ${order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}">
              <i class="bi bi-check-circle"></i>
              <span>Order Confirmed</span>
            </div>
            <div class="tracking-step ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}">
              <i class="bi bi-gear"></i>
              <span>Processing</span>
            </div>
            <div class="tracking-step ${order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}">
              <i class="bi bi-truck"></i>
              <span>Shipped</span>
            </div>
            <div class="tracking-step ${order.status === 'delivered' ? 'active' : ''}">
              <i class="bi bi-box-seam"></i>
              <span>Delivered</span>
            </div>
          </div>
        </div>
      `,
      confirmButtonColor: '#000',
      confirmButtonText: 'Close'
    });
  }

  reorder(order: any) {
    Swal.fire({
      title: 'Reorder Items?',
      text: 'Add all items from this order to your cart?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, add to cart',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        order.items.forEach((item: any) => {
          this.cartService.addToCart(item);
        });
        
        Swal.fire({
          title: 'Added to Cart!',
          text: 'All items from this order have been added to your cart.',
          icon: 'success',
          confirmButtonColor: '#000'
        });
      }
    });
  }

  downloadInvoice(order: any) {
    this.isGeneratingInvoice[order.id] = true;
    
    Swal.fire({
      title: 'Generating Invoice...',
      text: 'Please wait while we prepare your invoice.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Add company header
      pdf.setFillColor(44, 62, 80);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text('ASHTANA', pageWidth / 2, 18, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text('INVOICE', pageWidth / 2, 25, { align: 'center' });
      
      // Order details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(`Order ID: ${order.id}`, 20, 45);
      pdf.text(`Date: ${this.formatDateForInvoice(order.date)}`, 20, 52);
      pdf.text(`Payment Method: ${this.getOrderPaymentMethodLabel(order.paymentMethod)}`, 20, 59);
      pdf.text(`Status: ${order.status || 'confirmed'}`, 20, 66);
      
      // Customer information
      pdf.setFontSize(12);
      pdf.text('BILL TO:', 20, 80);
      pdf.setFontSize(10);
      pdf.text(`${order.customer.firstName} ${order.customer.lastName}`, 20, 87);
      pdf.text(order.customer.email, 20, 94);
      pdf.text(order.customer.phone, 20, 101);
      pdf.text(order.customer.address, 20, 108);
      pdf.text(`${order.customer.city}, ${order.customer.province} ${order.customer.postalCode}`, 20, 115);
      
      // Items table header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, 130, pageWidth - 40, 10, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text('Item', 22, 137);
      pdf.text('Price', 120, 137);
      pdf.text('Qty', 150, 137);
      pdf.text('Total', 170, 137);
      
      // Items
      let yPosition = 145;
      order.items.forEach((item: any, index: number) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(item.name.substring(0, 40), 22, yPosition);
        pdf.text(`$${item.price.toFixed(2)}`, 120, yPosition);
        pdf.text(item.quantity.toString(), 150, yPosition);
        pdf.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPosition);
        yPosition += 8;
        
        // Variants
        if (item.selectedColor || item.selectedSize) {
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          const variants = `${item.selectedColor || ''} ${item.selectedSize ? 'Size: ' + item.selectedSize : ''}`.trim();
          pdf.text(variants, 22, yPosition);
          yPosition += 5;
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
        }
        yPosition += 4;
      });
      
      // Totals
      yPosition = Math.max(yPosition + 10, 260);
      pdf.setFontSize(11);
      pdf.text('Subtotal:', 140, yPosition);
      pdf.text(`$${order.subtotal.toFixed(2)}`, 170, yPosition);
      yPosition += 8;
      
      pdf.text('Shipping:', 140, yPosition);
      pdf.text(order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`, 170, yPosition);
      yPosition += 8;
      
      pdf.text('GST (5%):', 140, yPosition);
      pdf.text(`$${order.gst.toFixed(2)}`, 170, yPosition);
      yPosition += 8;
      
      pdf.text('PST (7%):', 140, yPosition);
      pdf.text(`$${order.pst.toFixed(2)}`, 170, yPosition);
      yPosition += 8;
      
      if (order.discount > 0) {
        pdf.text('Discount:', 140, yPosition);
        pdf.text(`-$${order.discount.toFixed(2)}`, 170, yPosition);
        yPosition += 8;
      }
      
      pdf.setFontSize(12);
      pdf.text('TOTAL:', 140, yPosition);
      pdf.text(`$${order.total.toFixed(2)}`, 170, yPosition);
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Thank you for your purchase!', pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
      pdf.text('For any inquiries, please contact support@ashtana.com', pageWidth / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
      
      // Save the PDF
      pdf.save(`invoice-${order.id}.pdf`);
      
      this.isGeneratingInvoice[order.id] = false;
      Swal.close();
      
      Swal.fire({
        icon: 'success',
        title: 'Invoice Downloaded!',
        text: 'Your invoice has been downloaded successfully.',
        confirmButtonColor: '#000'
      });
    }, 1000);
  }

  getOrderPaymentMethodLabel(paymentMethod: string): string {
    const methods: { [key: string]: string } = {
      'cod': 'Cash on Delivery (COD)',
      'card': 'Credit/Debit Card',
      'paypal': 'PayPal'
    };
    return methods[paymentMethod] || 'Unknown';
  }

  formatDateForInvoice(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  getTotalItems(order: any): number {
    return order.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
  }

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  getCustomerName(order: any): string {
    if (order.customer.firstName && order.customer.lastName) {
      return `${order.customer.firstName} ${order.customer.lastName}`;
    } else if (order.customer.name) {
      return order.customer.name;
    }
    return 'Unknown Customer';
  }

  getCustomerAddress(order: any): string {
    if (order.customer.address && order.customer.city && order.customer.province) {
      return `${order.customer.address}, ${order.customer.city}, ${order.customer.province} ${order.customer.postalCode || ''}`;
    } else if (order.customer.address) {
      return order.customer.address;
    }
    return 'Address not available';
  }
}