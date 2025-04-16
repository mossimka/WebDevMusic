import { Component, Input, inject } from '@angular/core'; // Import Input and inject
import { CartService } from '../../services/cart.service'; // Adjust path as needed
import { CommonModule } from '@angular/common'; // Import CommonModule if using *ngIf etc. in template

@Component({
  selector: 'app-cart-button',
  standalone: true, // Make it standalone
  imports: [
    CommonModule // Add CommonModule if needed for template directives like *ngIf
  ],
  templateUrl: './cart-button.component.html',
  styleUrl: './cart-button.component.css'
})
export class CartButtonComponent {
  @Input() productId: number | undefined;
  private cartService = inject(CartService);

  isLoading = false;

  AddToCart() {
    if (this.productId === undefined) {
      console.error("CartButtonComponent: Product ID is missing.");
      alert("Cannot add to cart: Product ID is missing.");
      return;
    }

    this.isLoading = true;

    const itemToAdd = {
      product: this.productId,
      quantity: 1
    };

    this.cartService.addCartItem(itemToAdd).subscribe({
      next: (addedItem) => {
        console.log('Item added successfully:', addedItem);
        this.isLoading = false;
        alert(`${addedItem.product_name} added to cart!`);
      }
    });
  }
}
