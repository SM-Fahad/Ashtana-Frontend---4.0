import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HomeComponent } from './components/home/home.component';
import { SocialComponent } from './components/social/social.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { WomenComponent } from './components/women/women.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryFormComponent } from './components/category/category-form/category-form.component';
import { ColorListComponent } from './components/color/color-list/color-list.component';
import { ColorAddComponent } from './components/color/color-add/color-add.component';
import { SizeFormComponent } from './components/size/size-form/size-form.component';
import { SizeListComponent } from './components/size/size-list/size-list.component';
import { SubCategoryListComponent } from './components/sub-category/sub-category-list/sub-category-list.component';
import { SubCategoryFormComponent } from './components/sub-category/sub-category-form/sub-category-form.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarBottomComponent } from './components/navbar-bottom/navbar-bottom.component';






@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CarouselComponent,
    HomeComponent,
    SocialComponent,
    FooterComponent,
    AboutUsComponent,
    ContactUsComponent,
    WomenComponent,
    CartComponent,
    OrdersComponent,
    AdminComponent,
    LoginComponent,
    SignupComponent,
    CategoryListComponent,
    CategoryFormComponent,
    ColorListComponent,
    ColorAddComponent,
    SizeFormComponent,
    SizeListComponent,
    SubCategoryListComponent,
    SubCategoryFormComponent,
    ProductFormComponent,
    ProductListComponent,
    ProductsComponent,
    ProductDetailsComponent,
    ProfileComponent,
    NavbarBottomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
