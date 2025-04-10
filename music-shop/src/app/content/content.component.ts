import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../interfaces/product';
import { ShopItemsComponent } from '../shop-items/shop-items.component';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Category } from '../interfaces/category';

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
  filter: string = "";
  categories: Category[] = [];
  selectedCategories: number[] = [];

  constructor() {}

  ngOnInit() {
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
    this.filter = text; // Update the filter property
    this.applyFilters();
  }

  toggleCategory(category: Category) { // Change parameter type to Category
    const index = this.selectedCategories.indexOf(category.id);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category.id);
    }
    console.log('Toggled Category:', category, 'Selected Categories:', this.selectedCategories);
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.productsList];

    if (this.filter) {
      filtered = filtered.filter(product =>
        product?.name?.toLowerCase().includes(this.filter.toLowerCase())
      );
    }

    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        const productCategoryId = product.category; // Get the category ID
        const isSelected = this.selectedCategories.includes(productCategoryId); // Compare IDs

        console.log(`Filtering: Product Category ID: ${productCategoryId}, Selected Category IDs:`, this.selectedCategories, `Match:`, isSelected);

        return isSelected;
      });
    }
    this.filteredProductsList = filtered;
  }

  onProductRemoved(productId: Number) {
    this.productsList = this.productsList.filter(p => p.id !== productId);
    this.filteredProductsList = this.filteredProductsList.filter(p => p.id !== productId);
  }
}
