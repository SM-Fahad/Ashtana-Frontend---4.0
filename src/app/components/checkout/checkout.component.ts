import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  
  subtotal: number = 0;
  shipping: number = 5.99;
  gst: number = 0;
  pst: number = 0;
  discount: number = 0;
  totalPayable: number = 0;

  couponCode: string = '';
  orderPlaced: boolean = false;
  isProcessing: boolean = false;
  orderId: string = '';
  isGeneratingInvoice: boolean = false;

  paymentMethod: string = 'cod';
  
  checkoutData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    paypalEmail: '',
    saveInfo: false
  };

  provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
    'Prince Edward Island', 'Quebec', 'Saskatchewan'
  ];

  paymentMethods = [
    { value: 'cod', label: 'Cash on Delivery (COD)' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'paypal', label: 'PayPal' }
  ];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.loadCartItems();
    this.calculateTotals();
  }

  loadCartItems() {
    const backendUrl = 'http://localhost:8081';
    this.cartItems = this.cartService.getCart().map(item => ({
      ...item,
      quantity: item.quantity || 1,
      imageUrl: item.imageUrl
        ? item.imageUrl
        : item.imageUrls && item.imageUrls.length
        ? /^https?:\/\//.test(item.imageUrls[0])
          ? item.imageUrls[0]
          : `${backendUrl}${item.imageUrls[0]}`
        : 'assets/images/placeholder-product.jpg'
    }));
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.cartService.updateCart(this.cartItems);
    this.calculateTotals();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(this.cartItems);
      this.calculateTotals();
    }
  }

  removeItem(index: number) {
    Swal.fire({
      title: 'Remove Item?',
      text: 'Are you sure you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartItems.splice(index, 1);
        this.cartService.updateCart(this.cartItems);
        this.calculateTotals();
        
        Swal.fire(
          'Removed!',
          'Item has been removed from your cart.',
          'success'
        );
      }
    });
  }

  applyCoupon() {
    if (!this.couponCode.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Coupon Required',
        text: 'Please enter a coupon code.',
        confirmButtonColor: '#000'
      });
      return;
    }

    const coupon = this.couponCode.trim().toUpperCase();
    if (coupon === 'ASH10') {
      this.discount = this.subtotal * 0.10;
      Swal.fire({
        icon: 'success',
        title: 'Coupon Applied!',
        text: '10% discount has been applied to your order.',
        confirmButtonColor: '#000'
      });
    } else if (coupon === 'ASH20') {
      this.discount = this.subtotal * 0.20;
      Swal.fire({
        icon: 'success',
        title: 'Coupon Applied!',
        text: '20% discount has been applied to your order.',
        confirmButtonColor: '#000'
      });
    } else if (coupon === 'FREESHIP') {
      this.discount = this.shipping;
      Swal.fire({
        icon: 'success',
        title: 'Coupon Applied!',
        text: 'Free shipping has been applied to your order.',
        confirmButtonColor: '#000'
      });
    } else {
      this.discount = 0;
      Swal.fire({
        icon: 'error',
        title: 'Invalid Coupon',
        text: 'The coupon code you entered is invalid.',
        confirmButtonColor: '#000'
      });
    }
    this.calculateTotals();
  }

  removeCoupon() {
    this.couponCode = '';
    this.discount = 0;
    this.calculateTotals();
    Swal.fire({
      icon: 'success',
      title: 'Coupon Removed',
      text: 'Coupon has been removed from your order.',
      confirmButtonColor: '#000',
      timer: 1500,
      showConfirmButton: false
    });
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.gst = this.subtotal * 0.05;
    this.pst = this.subtotal * 0.07;
    
    // Free shipping for orders over $50
    this.shipping = this.subtotal >= 50 ? 0 : 5.99;
    
    this.totalPayable = this.subtotal + this.gst + this.pst + this.shipping - this.discount;
  }

  validateForm(): boolean {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];

    for (const field of requiredFields) {
      if (!this.checkoutData[field as keyof typeof this.checkoutData]) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Information',
          text: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          confirmButtonColor: '#000'
        });
        return false;
      }
    }

    // Payment method specific validation
    if (this.paymentMethod === 'card') {
      if (!this.checkoutData.cardNumber || !this.checkoutData.expiryDate || !this.checkoutData.cvv || !this.checkoutData.nameOnCard) {
        Swal.fire({
          icon: 'warning',
          title: 'Payment Information Required',
          text: 'Please fill in all card details.',
          confirmButtonColor: '#000'
        });
        return false;
      }
    } else if (this.paymentMethod === 'paypal') {
      if (!this.checkoutData.paypalEmail) {
        Swal.fire({
          icon: 'warning',
          title: 'PayPal Email Required',
          text: 'Please enter your PayPal email address.',
          confirmButtonColor: '#000'
        });
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.checkoutData.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#000'
      });
      return false;
    }

    // PayPal email validation
    if (this.paymentMethod === 'paypal' && !emailRegex.test(this.checkoutData.paypalEmail)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid PayPal Email',
        text: 'Please enter a valid PayPal email address.',
        confirmButtonColor: '#000'
      });
      return false;
    }

    return true;
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Your cart is empty. Please add items before placing an order.',
        confirmButtonColor: '#000'
      });
      return;
    }

    if (!this.validateForm()) {
      return;
    }

    this.isProcessing = true;

    // Generate order ID
    this.orderId = 'ORD-' + Date.now();

    // Simulate processing delay
    setTimeout(() => {
      const order = {
        id: this.orderId,
        items: this.cartItems,
        subtotal: this.subtotal,
        shipping: this.shipping,
        gst: this.gst,
        pst: this.pst,
        discount: this.discount,
        total: this.totalPayable,
        customer: { ...this.checkoutData },
        paymentMethod: this.paymentMethod,
        date: new Date().toISOString(),
        status: 'confirmed'
      };

      this.cartService.saveOrder(order);
      this.cartService.clearCart();
      this.isProcessing = false;
      this.orderPlaced = true;

      // Scroll to top to show success message
      window.scrollTo(0, 0);
    }, 2000);
  }

  generateInvoice() {
    this.isGeneratingInvoice = true;
    
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
      pdf.text(`Order ID: ${this.orderId}`, 20, 45);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);
      pdf.text(`Payment Method: ${this.getPaymentMethodLabel()}`, 20, 59);
      
      // Customer information
      pdf.setFontSize(12);
      pdf.text('BILL TO:', 20, 75);
      pdf.setFontSize(10);
      pdf.text(`${this.checkoutData.firstName} ${this.checkoutData.lastName}`, 20, 82);
      pdf.text(this.checkoutData.email, 20, 89);
      pdf.text(this.checkoutData.phone, 20, 96);
      pdf.text(this.checkoutData.address, 20, 103);
      pdf.text(`${this.checkoutData.city}, ${this.checkoutData.province} ${this.checkoutData.postalCode}`, 20, 110);
      
      // Items table header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, 125, pageWidth - 40, 10, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text('Item', 22, 132);
      pdf.text('Price', 120, 132);
      pdf.text('Qty', 150, 132);
      pdf.text('Total', 170, 132);
      
      // Items
      let yPosition = 140;
      this.cartItems.forEach((item, index) => {
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
      pdf.text(`$${this.subtotal.toFixed(2)}`, 170, yPosition);
      yPosition += 8;
      
      pdf.text('Shipping:', 140, yPosition);
      pdf.text(this.shipping === 0 ? 'FREE' : `$${this.shipping.toFixed(2)}`, 170, yPosition);
      yPosition += 8;
      
      pdf.text('GST (5%):', 140, yPosition);
      pdf.text(`$${this.gst.toFixed(2)}`, 170, yPosition);
      yPosition += 8;
      
      pdf.text('PST (7%):', 140, yPosition);
      pdf.text(`$${this.pst.toFixed(2)}`, 170, yPosition);
      yPosition += 8;
      
      if (this.discount > 0) {
        pdf.text('Discount:', 140, yPosition);
        pdf.text(`-$${this.discount.toFixed(2)}`, 170, yPosition);
        yPosition += 8;
      }
      
      pdf.setFontSize(12);
      // pdf.setFont(undefined, 'bold');
      pdf.text('TOTAL:', 140, yPosition);
      pdf.text(`$${this.totalPayable.toFixed(2)}`, 170, yPosition);
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Thank you for your purchase!', pageWidth / 2, pageWidth - 10, { align: 'center' });
      pdf.text('For any inquiries, please contact support@ashtana.com', pageWidth / 2, pageWidth - 5, { align: 'center' });
      
      // Save the PDF
      pdf.save(`invoice-${this.orderId}.pdf`);
      
      this.isGeneratingInvoice = false;
      Swal.close();
      
      Swal.fire({
        icon: 'success',
        title: 'Invoice Downloaded!',
        text: 'Your invoice has been downloaded successfully.',
        confirmButtonColor: '#000'
      });
    }, 1000);
  }

  getPaymentMethodLabel(): string {
    const method = this.paymentMethods.find(m => m.value === this.paymentMethod);
    return method ? method.label : 'Unknown';
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      event.target.value = parts.join(' ');
    } else {
      event.target.value = value;
    }
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length >= 2) {
      event.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  get isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  // Helper to check if card fields should be shown
  get showCardFields(): boolean {
    return this.paymentMethod === 'card';
  }

  // Helper to check if PayPal field should be shown
  get showPaypalField(): boolean {
    return this.paymentMethod === 'paypal';
  }
}