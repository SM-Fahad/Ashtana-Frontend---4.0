import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { BagService } from '../../services/bag.service';
import { AuthService } from '../../services/auth.service';
import { AddressService } from '../../services/address.service';
import { PaymentService } from '../../services/payment.service';
import { CouponService } from '../../services/coupon.service';
import { Order, CheckoutRequest, Address, PaymentRequest, Coupon, CouponValidationResponse } from '../../models/order';
import { MyBag } from '../../models/bag';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  bag: MyBag | null = null;
  addresses: Address[] = [];
  loading = false;
  processingOrder = false;
  selectedStep = 1;
  useSameAddress = true;
  couponCode = '';
  showAddAddressForm = false;
  newAddressForm: FormGroup;
  appliedCoupon: Coupon | null = null;
  couponDiscount = 0;
  validatingCoupon = false;

  // Payment methods
  paymentMethods = [
    { value: 'COD', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive your order' },
    { value: 'CREDIT_CARD', name: 'Credit Card', icon: '💳', description: 'Pay securely with your credit card' },
    { value: 'DEBIT_CARD', name: 'Debit Card', icon: '💳', description: 'Pay securely with your debit card' },
    { value: 'PAYPAL', name: 'PayPal', icon: '🔵', description: 'Pay with your PayPal account' }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private bagService: BagService,
    private authService: AuthService,
    private addressService: AddressService,
    private paymentService: PaymentService,
    private couponService: CouponService,
    private router: Router
  ) {
    this.checkoutForm = this.createCheckoutForm();
    this.newAddressForm = this.createNewAddressForm();
  }

  ngOnInit(): void {
    this.loadBag();
    this.loadAddresses();
  }

  createCheckoutForm(): FormGroup {
    return this.fb.group({
      shippingAddressId: ['', Validators.required],
      billingAddressId: [''],
      paymentMethod: ['COD', Validators.required],
      couponCode: [''],
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }

  createNewAddressForm(): FormGroup {
    return this.fb.group({
      recipientName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['SHIPPING', Validators.required]
    });
  }

  // Payment method helper
  getPaymentMethodName(method: string): string {
    if (!method) return 'Not selected';
    const payment = this.paymentMethods.find(p => p.value === method);
    return payment ? payment.name : method;
  }

  // Getter for selected payment method
  get selectedPaymentMethod(): string {
    const method = this.checkoutForm.get('paymentMethod')?.value;
    return this.getPaymentMethodName(method);
  }

  // Getter for COD check
  get isCODPayment(): boolean {
    return this.checkoutForm.get('paymentMethod')?.value === 'COD';
  }

  loadBag(): void {
    this.loading = true;
    const userName = this.getCurrentUserName();
    
    if (!userName) {
      this.router.navigate(['/login']);
      return;
    }

    this.bagService.getBagByUserName(userName).subscribe({
      next: (bag) => {
        this.bag = bag;
        this.loading = false;
        
        if (!bag.items || bag.items.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Empty Bag',
            text: 'Your shopping bag is empty. Add items before checkout.',
            confirmButtonColor: '#000'
          }).then(() => {
            this.router.navigate(['/products']);
          });
        }
      },
      error: (error) => {
        console.error('Error loading bag:', error);
        this.loading = false;
        this.showError('Failed to load bag', 'Please try again later.');
      }
    });
  }

  loadAddresses(): void {
    const userName = this.getCurrentUserName();
    if (!userName) return;

    this.addressService.getUserAddresses(userName).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        
        // Set default addresses
        const defaultAddress = addresses[0];
        if (defaultAddress) {
          this.checkoutForm.patchValue({
            shippingAddressId: defaultAddress.id
          });
          
          // Set billing address to same if using same address
          if (this.useSameAddress) {
            this.checkoutForm.patchValue({
              billingAddressId: defaultAddress.id
            });
          }
        }
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        if (error.status !== 404) {
          this.showError('Failed to load addresses', 'Please try again later.');
        }
      }
    });
  }

  getCurrentUserName(): string | null {
    const user = this.authService.getUser();
    return user?.userName || user?.username || null;
  }

  // Step navigation
  nextStep(): void {
    if (this.selectedStep < 3) {
      this.selectedStep++;
    }
  }

  prevStep(): void {
    if (this.selectedStep > 1) {
      this.selectedStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 3) {
      this.selectedStep = step;
    }
  }

  // Address handling
  onUseSameAddressChange(): void {
    if (this.useSameAddress) {
      this.checkoutForm.patchValue({
        billingAddressId: this.checkoutForm.get('shippingAddressId')?.value
      });
    }
  }

  onShippingAddressChange(): void {
    if (this.useSameAddress) {
      this.checkoutForm.patchValue({
        billingAddressId: this.checkoutForm.get('shippingAddressId')?.value
      });
    }
  }

  // Add new address
  addNewAddress(): void {
    if (this.newAddressForm.invalid) {
      this.markFormGroupTouched(this.newAddressForm);
      return;
    }

    const addressData = {
      ...this.newAddressForm.value,
      userName: this.getCurrentUserName()
    };

    this.addressService.createAddress(addressData).subscribe({
      next: (newAddress) => {
        this.addresses.push(newAddress);
        this.checkoutForm.patchValue({
          shippingAddressId: newAddress.id
        });
        this.showAddAddressForm = false;
        this.newAddressForm.reset({ type: 'SHIPPING' });
        Swal.fire({
          icon: 'success',
          title: 'Address Added',
          text: 'New address has been added successfully.',
          confirmButtonColor: '#000'
        });
      },
      error: (error) => {
        console.error('Error adding address:', error);
        this.showError('Failed to add address', 'Please try again.');
      }
    });
  }

  // Coupon handling
  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.showError('Invalid Coupon', 'Please enter a coupon code.');
      return;
    }

    if (!this.bag?.totalPrice) {
      this.showError('Cannot Apply Coupon', 'Your bag is empty.');
      return;
    }

    this.validatingCoupon = true;

    this.couponService.validateCoupon(this.couponCode, this.bag.totalPrice).subscribe({
      next: (response) => {
        this.validatingCoupon = false;
        
        if (response.valid && response.coupon) {
          this.appliedCoupon = response.coupon;
          this.couponDiscount = response.discountAmount;
          
          Swal.fire({
            icon: 'success',
            title: 'Coupon Applied!',
            html: `
              <div class="text-start">
                <p><strong>Coupon:</strong> ${response.coupon.code}</p>
                <p><strong>Discount:</strong> $${response.discountAmount.toFixed(2)}</p>
                ${response.coupon.discountPercentage ? 
                  `<p><strong>Discount:</strong> ${response.coupon.discountPercentage}% off</p>` : ''}
                <p class="text-muted">${response.message}</p>
              </div>
            `,
            confirmButtonColor: '#000'
          });
        } else {
          this.appliedCoupon = null;
          this.couponDiscount = 0;
          this.showError('Invalid Coupon', response.message || 'This coupon cannot be applied to your order.');
        }
      },
      error: (error) => {
        this.validatingCoupon = false;
        console.error('Coupon validation error:', error);
        this.showError('Coupon Error', 'Failed to validate coupon. Please try again.');
      }
    });
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponDiscount = 0;
    this.couponCode = '';
    Swal.fire({
      icon: 'info',
      title: 'Coupon Removed',
      text: 'Coupon has been removed from your order.',
      confirmButtonColor: '#000'
    });
  }

  // Checkout
  async placeOrder(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      this.showError('Form Incomplete', 'Please fill all required fields.');
      return;
    }

    if (!this.bag || this.bag.items.length === 0) {
      this.showError('Empty Bag', 'Your shopping bag is empty.');
      return;
    }

    this.processingOrder = true;

    try {
      const formValue = this.checkoutForm.value;
      const checkoutRequest: CheckoutRequest = {
        userName: this.getCurrentUserName()!,
        shippingAddressId: formValue.shippingAddressId,
        billingAddressId: this.useSameAddress ? undefined : formValue.billingAddressId,
        couponCode: this.appliedCoupon?.code || undefined,
        paymentMethod: formValue.paymentMethod
      };

      // Create order
      const order = await this.orderService.checkout(checkoutRequest).toPromise();
      
      if (order) {
        // Handle payment based on method
        if (formValue.paymentMethod === 'COD') {
          await this.handleCODPayment(order);
        } else {
          await this.handleOnlinePayment(order);
        }
      }

    } catch (error: any) {
      this.processingOrder = false;
      console.error('Checkout error:', error);
      this.showError('Checkout Failed', error.error?.message || 'Please try again later.');
    }
  }

  private async handleCODPayment(order: Order): Promise<void> {
    try {
      // For COD, we just need to confirm the payment
      const payment = await this.paymentService.confirmCOD(order.id).toPromise();
      this.processingOrder = false;
      this.showOrderSuccess(order, payment!);
    } catch (error) {
      throw error;
    }
  }

  private async handleOnlinePayment(order: Order): Promise<void> {
    try {
      // For online payments, initiate payment process
      const paymentRequest: PaymentRequest = {
        orderId: order.id,
        paymentMethod: order.paymentMethod,
        amount: order.totalAmount
      };

      const payment = await this.paymentService.initiatePayment(paymentRequest).toPromise();
      
      // Simulate payment processing (in real app, redirect to payment gateway)
      if (payment) {
        // Wait for payment to be processed (simulated)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check payment status
        const paymentStatus = await this.paymentService.getPaymentStatus(payment.id).toPromise();
        this.processingOrder = false;
        
        if (paymentStatus?.paymentStatus === 'COMPLETED') {
          this.showOrderSuccess(order, paymentStatus);
        } else {
          this.showError('Payment Failed', 'Your payment could not be processed. Please try again.');
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // Success handler
  private showOrderSuccess(order: Order, payment: any): void {
    Swal.fire({
      title: '🎉 Order Placed Successfully!',
      html: `
        <div class="text-start">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${this.getPaymentMethodName(order.paymentMethod)}</p>
          <p><strong>Payment Status:</strong> ${payment.paymentStatus}</p>
          ${this.appliedCoupon ? `<p><strong>Coupon Applied:</strong> ${this.appliedCoupon.code} ($${this.couponDiscount.toFixed(2)} off)</p>` : ''}
          <p class="mt-3">You will receive an email confirmation shortly.</p>
        </div>
      `,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'View Order Details',
      cancelButtonText: 'Continue Shopping',
      confirmButtonColor: '#000',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/orders', order.id]);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  // Helper methods
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showError(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#000'
    });
  }

  getSelectedShippingAddress(): Address | undefined {
    const addressId = this.checkoutForm.get('shippingAddressId')?.value;
    return this.addresses.find(addr => addr.id === addressId);
  }

  getSelectedBillingAddress(): Address | undefined {
    const addressId = this.checkoutForm.get('billingAddressId')?.value;
    return this.addresses.find(addr => addr.id === addressId);
  }

  // Getters for template
  get shippingCost(): number {
    return this.bag?.totalPrice && this.bag.totalPrice >= 150 ? 0 : 30;
  }

  get taxAmount(): number {
    const subtotal = this.bag?.totalPrice || 0;
    const discountedSubtotal = subtotal - this.couponDiscount;
    return discountedSubtotal > 0 ? (discountedSubtotal * 0.12) : 0;
  }

  get estimatedTotal(): number {
    const subtotal = this.bag?.totalPrice || 0;
    const discountedSubtotal = subtotal - this.couponDiscount;
    return Math.max(0, discountedSubtotal + this.shippingCost + this.taxAmount);
  }

  get isStep1Valid(): boolean {
    return this.checkoutForm.get('shippingAddressId')?.valid || false;
  }

  get isStep2Valid(): boolean {
    return this.checkoutForm.get('paymentMethod')?.valid || false;
  }

  get isStep3Valid(): boolean {
    return this.checkoutForm.get('agreeToTerms')?.value || false;
  }

  get couponSavingsText(): string {
    if (!this.appliedCoupon) return '';
    
    if (this.appliedCoupon.discountPercentage) {
      return `${this.appliedCoupon.discountPercentage}% off`;
    } else {
      return `$${this.couponDiscount.toFixed(2)} off`;
    }
  }
}