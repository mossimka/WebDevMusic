import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  product: Product | undefined;
  shareLinks: { telegram: string; whatsapp: string } | undefined;

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe((product: Product) => {
      this.product = product;
      if (product?.link) {
        this.shareLinks = this.generateShareLinks(product.link);
      }
    });
  }

  generateShareLinks(originalLink: string) {
    const encodedLink = encodeURIComponent(originalLink);
    return {
      telegram: `https://t.me/share/url?url=${encodedLink}`,
      whatsapp: `https://api.whatsapp.com/send?text=Check%20this%20out:%20${encodedLink}`
    };
  }
}
