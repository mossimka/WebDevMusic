import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MusicsService } from '../musics.service';
import { Product } from '../product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrl: `details.component.css`
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  musicsService = inject(MusicsService);
  product: Product | undefined;
  shareLinks: { telegram: string; whatsapp: string } | undefined;

  constructor() {
    const musicItemsId = Number(this.route.snapshot.params['id']);
    this.musicsService.getProductById(musicItemsId).then(product => {
      this.product = product;
      if (this.product?.link) {
        this.shareLinks = this.generateShareLinks(this.product.link);
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
