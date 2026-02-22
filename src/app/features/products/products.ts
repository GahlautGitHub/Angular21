import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { ProductService, User } from './services/products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ScrollingModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private productService = inject(ProductService);

  // Core State Signals
  products = signal<User[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');

  // Derived State: Automatically updates when products or searchQuery changes
  filteredProducts = computed(() => {
    const list = this.products();
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) return list;

    return list.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.email?.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  editRecord(id: number) {
    const currentList = this.products();
    const userToEdit = currentList.find(p => p.id === id);
    if (!userToEdit) return;

    const newName = prompt('Edit User Name:', userToEdit.name);
    
    // Only proceed if name changed and isn't empty
    if (newName && newName !== userToEdit.name) {
      const updatedUser = { ...userToEdit, name: newName };

      this.productService.updateUser(updatedUser).subscribe({
        next: () => {
          // UPDATE SIGNAL: This triggers the computed filteredProducts automatically
          this.products.update(list => 
            list.map(p => p.id === id ? updatedUser : p)
          );
        },
        error: (err) => alert('Update failed: ' + err.message)
      });
    }
  }

  deleteRecord(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.productService.deleteUser(id).subscribe({
        next: () => {
          // UPDATE SIGNAL: Items will vanish from the Virtual Scroll instantly
          this.products.update(list => list.filter(p => p.id !== id));
        },
        error: (err) => alert('Delete failed: ' + err.message)
      });
    }
  }
}