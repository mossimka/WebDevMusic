import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { ShopItemsComponent } from '../shop-items/shop-items.component';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ShopItemsComponent, CommonModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent {
  productsList: Product[] = [];
  productService: ProductService = inject(ProductService);
  categoryService: CategoryService = inject(CategoryService);
  filteredProductsList: Product[] = [];
  filter: string = '';
  categories: Category[] = [];
  selectedCategories: string[] = [];
  user: User | null = null;
  authService: AuthService = inject(AuthService);

  constructor() {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((data) => {
      this.user = data;
    });
    this.filter = '';
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.productsList = products;
      this.filteredProductsList = [...products]; // Initialize with a copy
    });
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  filterResults(text: string) {
    this.filter = text;
    this.applyFilters();
  }

  toggleCategory(category: Category) {
    const categoryName = category.name;
    const index = this.selectedCategories.indexOf(categoryName);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryName);
    }
    console.log(
      'Toggled Category:',
      categoryName,
      'Selected Categories:',
      this.selectedCategories
    );
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.productsList];
    if (this.filter) {
      filtered = filtered.filter((product) =>
        product?.name?.toLowerCase().includes(this.filter.toLowerCase())
      );
    }

    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        const isSelected = this.selectedCategories.includes(product.category);

        return isSelected;
      });
    }
    this.filteredProductsList = filtered;
  }

  onProductRemoved(productId: Number) {
    this.productsList = this.productsList.filter((p) => p.id !== productId);
    this.applyFilters();
  }
}
