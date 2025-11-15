import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { WomenComponent } from './components/women/women.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryFormComponent } from './components/category/category-form/category-form.component';
import { ColorListComponent } from './components/color/color-list/color-list.component';
import { ColorAddComponent } from './components/color/color-add/color-add.component';
import { SizeListComponent } from './components/size/size-list/size-list.component';
import { SizeFormComponent } from './components/size/size-form/size-form.component';
import { SubCategoryListComponent } from './components/sub-category/sub-category-list/sub-category-list.component';
import { SubCategoryFormComponent } from './components/sub-category/sub-category-form/sub-category-form.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BagComponent } from './components/bag/bag.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  // { path: 'add-product', component: ProductAddEditComponent },
  // { path: 'edit-product/:id', component: ProductAddEditComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'women', component: WomenComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'category-add', component: CategoryFormComponent },
  { path: 'category-list', component: CategoryListComponent },
  { path: 'color-list', component: ColorListComponent },
  { path: 'color-add', component: ColorAddComponent },
  { path: 'size-list', component: SizeListComponent },
  { path: 'size-add', component: SizeFormComponent },
  { path: 'sub-category-list', component: SubCategoryListComponent },
  { path: 'sub-category-add', component: SubCategoryFormComponent },
  { path: 'product', component: ProductListComponent },
  { path: 'product/add', component: ProductFormComponent },
  { path: 'product/edit/:id', component: ProductFormComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'bag', component: BagComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
