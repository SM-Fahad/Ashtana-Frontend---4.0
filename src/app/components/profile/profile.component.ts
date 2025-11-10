import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Address {
  id: number;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  type: 'SHIPPING' | 'BILLING' | 'BOTH';
  phone: string;
  userName?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  addressForm: FormGroup;
  activeTab: string = 'profile';
  user: any = null;
  isLoading = false;
  isSaving = false;
  isChangingPassword = false;
  isAddingAddress = false;
  successMessage = '';
  errorMessage = '';
  addresses: Address[] = [];
  showAddressForm = false;
  editingAddress: Address | null = null;
  loadingAddresses = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      userName: ['', [Validators.required]],
      userFirstName: ['', [Validators.required]],
      userLastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.addressForm = this.fb.group({
      recipientName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      type: ['SHIPPING', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.user = this.authService.getUser();
    if (this.user) {
      this.profileForm.patchValue({
        userName: this.user.userName || '',
        userFirstName: this.user.userFirstName || '',
        userLastName: this.user.userLastName || '',
        email: this.user.email || '',
        phone: this.user.phone || ''
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
    this.showAddressForm = false;
    this.editingAddress = null;
    
    if (tab === 'addresses') {
      this.loadUserAddresses();
    }
  }

  onProfileSubmit() {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.successMessage = '';
      this.errorMessage = '';

      setTimeout(() => {
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        const updatedUser = { ...this.user, ...this.profileForm.value };
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        this.user = updatedUser;
      }, 1000);
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      this.successMessage = '';
      this.errorMessage = '';

      setTimeout(() => {
        this.isChangingPassword = false;
        this.successMessage = 'Password changed successfully!';
        this.passwordForm.reset();
      }, 1000);
    }
  }

  // Address Methods with API Calls
  loadUserAddresses() {
    if (this.user?.userName) {
      this.loadingAddresses = true;
      this.authService.getUserAddresses(this.user.userName).subscribe({
        next: (addresses: Address[]) => {
          this.addresses = addresses;
          this.loadingAddresses = false;
        },
        error: (error) => {
          console.error('Error loading addresses:', error);
          this.errorMessage = 'Failed to load addresses';
          this.loadingAddresses = false;
          this.addresses = [];
        }
      });
    }
  }

  showAddAddressForm() {
    this.showAddressForm = true;
    this.editingAddress = null;
    this.addressForm.reset({ type: 'SHIPPING' });
  }

  cancelAddressForm() {
    this.showAddressForm = false;
    this.editingAddress = null;
    this.addressForm.reset();
  }

  editAddress(address: Address) {
    this.showAddressForm = true;
    this.editingAddress = address;
    this.addressForm.patchValue({
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      type: address.type,
      phone: address.phone
    });
  }

  onAddressSubmit() {
    if (this.addressForm.valid && this.user?.userName) {
      this.isAddingAddress = true;
      const addressData = {
        ...this.addressForm.value,
        userName: this.user.userName
      };

      if (this.editingAddress) {
        // Update existing address
        this.authService.updateAddress(this.editingAddress.id, addressData).subscribe({
          next: (updatedAddress: Address) => {
            const index = this.addresses.findIndex(addr => addr.id === this.editingAddress!.id);
            if (index !== -1) {
              this.addresses[index] = updatedAddress;
            }
            this.isAddingAddress = false;
            this.showAddressForm = false;
            this.editingAddress = null;
            this.successMessage = 'Address updated successfully!';
          },
          error: (error) => {
            console.error('Error updating address:', error);
            this.isAddingAddress = false;
            this.errorMessage = 'Failed to update address. Please try again.';
          }
        });
      } else {
        // Create new address
        this.authService.createAddress(addressData).subscribe({
          next: (newAddress: Address) => {
            this.addresses.push(newAddress);
            this.isAddingAddress = false;
            this.showAddressForm = false;
            this.successMessage = 'Address added successfully!';
          },
          error: (error) => {
            console.error('Error creating address:', error);
            this.isAddingAddress = false;
            this.errorMessage = 'Failed to add address. Please try again.';
          }
        });
      }
    }
  }

  deleteAddress(addressId: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.authService.deleteAddress(addressId).subscribe({
        next: () => {
          this.addresses = this.addresses.filter(addr => addr.id !== addressId);
          this.successMessage = 'Address deleted successfully!';
        },
        error: (error) => {
          console.error('Error deleting address:', error);
          this.errorMessage = 'Failed to delete address. Please try again.';
        }
      });
    }
  }

  getAddressTypeBadgeClass(type: string): string {
    switch (type) {
      case 'SHIPPING': return 'bg-primary';
      case 'BILLING': return 'bg-success';
      case 'BOTH': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }

  getAddressTypeDisplay(type: string): string {
    switch (type) {
      case 'SHIPPING': return 'Shipping';
      case 'BILLING': return 'Billing';
      case 'BOTH': return 'Shipping & Billing';
      default: return type;
    }
  }

  getInitials(): string {
    if (this.user) {
      const first = this.user.userFirstName?.charAt(0) || '';
      const last = this.user.userLastName?.charAt(0) || '';
      return (first + last).toUpperCase();
    }
    return 'U';
  }

  get userRole(): string {
    if (this.user?.roles) {
      const roles = this.user.roles.map((role: any) => 
        role.roleName.replace('ROLE_', '').toLowerCase()
      );
      return roles.join(', ');
    }
    return 'user';
  }
}