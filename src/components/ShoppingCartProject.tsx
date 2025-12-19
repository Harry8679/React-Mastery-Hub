import { useState } from 'react';
import { ChevronLeft, Code2, ShoppingCart, Plus, Minus, Trash2, X, ShoppingBag, CreditCard } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

// ==================== MOCK DATA ====================
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    category: 'Ordinateurs',
    stock: 15,
    description: 'Puissant ordinateur portable pour professionnels',
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1703434123142-1b41a1b1055b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
    category: 'Smartphones',
    stock: 25,
    description: 'Dernier smartphone Apple',
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 249,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    category: 'Audio',
    stock: 50,
    description: 'Écouteurs sans fil avec réduction de bruit',
  },
  {
    id: 4,
    name: 'iPad Air',
    price: 699,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    category: 'Tablettes',
    stock: 20,
    description: 'Tablette légère et performante',
  },
  {
    id: 5,
    name: 'Apple Watch Ultra',
    price: 849,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    category: 'Montres',
    stock: 30,
    description: 'Montre connectée haut de gamme',
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    price: 149,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    category: 'Accessoires',
    stock: 40,
    description: 'Clavier sans fil élégant',
  },
  {
    id: 7,
    name: 'AirTag (Pack de 4)',
    price: 99,
    image: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400',
    category: 'Accessoires',
    stock: 100,
    description: 'Localisateurs Bluetooth',
  },
  {
    id: 8,
    name: 'HomePod Mini',
    price: 99,
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400',
    category: 'Audio',
    stock: 35,
    description: 'Enceinte intelligente compacte',
  },
];

// ==================== COMPOSANTS ====================

// Product Card
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
}

function ProductCard({ product, onAddToCart, isInCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
      <div className="relative h-48 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
          {product.stock} en stock
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">{product.price}€</div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isInCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              isInCart
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Plus size={16} />
            {isInCart ? 'Au panier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Cart Item
interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemComponentProps) {
  const total = item.price * item.quantity;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-gray-800">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{item.price}€ × {item.quantity}</div>
              <div className="text-xl font-bold text-blue-600">{total}€</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Modal
interface CartModalProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

function CartModal({ cart, isOpen, onClose, onUpdateQuantity, onRemove, onClearCart, onCheckout }: CartModalProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 29) : 0;
  const tax = subtotal * 0.2; // 20% TVA
  const total = subtotal + shipping + tax;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={24} />
            Panier ({cart.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span className="font-semibold">{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison {shipping === 0 && <span className="text-green-600">(Gratuite)</span>}</span>
                <span className="font-semibold">{shipping.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA (20%)</span>
                <span className="font-semibold">{tax.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-blue-600">{total.toFixed(2)}€</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClearCart}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
              >
                Vider le panier
              </button>
              <button
                onClick={onCheckout}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Commander
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function ShoppingCartProject({ onBack }: ProjectComponentProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = ['Tous', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  const filteredProducts = selectedCategory === 'Tous'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) return;

    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (confirm('Vider tout le panier ?')) {
      setCart([]);
    }
  };

  const handleCheckout = () => {
    setOrderSuccess(true);
    setCart([]);
    setIsCartOpen(false);
    setTimeout(() => setOrderSuccess(false), 3000);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🛒 Shopping Cart</h1>
              <div className="flex flex-wrap gap-2 mt-4">
                {["E-commerce", "Cart Management", "State"].map((concept) => (
                  <span
                    key={concept}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold flex items-center gap-2 shadow-lg"
            >
              <ShoppingCart size={24} />
              Panier
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {orderSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fadeIn">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Commande confirmée !</h3>
            <p className="text-green-700">Merci pour votre achat. Vous recevrez un email de confirmation.</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              isInCart={cart.some((item) => item.id === product.id)}
            />
          ))}
        </div>

        {/* Explanation */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Code2 size={20} className="text-blue-500" />
            Fonctionnalités du Shopping Cart :
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">🛍️ Catalogue :</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>8 produits avec images réelles</li>
                <li>Filtrage par catégories</li>
                <li>Gestion du stock</li>
                <li>Indication "Au panier"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🛒 Panier :</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Ajout/Retrait produits</li>
                <li>Modification quantités</li>
                <li>Badge compteur</li>
                <li>Modal plein écran</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💰 Calculs :</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Sous-total automatique</li>
                <li>Livraison (gratuite si &gt; 500€)</li>
                <li>TVA 20%</li>
                <li>Total TTC</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✨ UX :</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Animations hover</li>
                <li>Message de confirmation</li>
                <li>Vider le panier</li>
                <li>Responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}