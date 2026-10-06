import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} />
        ) : (
          <div className="product-card-placeholder">{product.category}</div>
        )}
      </div>
      <div className="product-card-body">
        <h3>{product.title}</h3>
        <p className="product-card-price">R{product.price.toFixed(2)}</p>
        <p className="product-card-seller">
          {product.seller?.businessName || product.seller?.name || "Unknown seller"}
          {product.seller?.ratingCount > 0 && (
            <span> · ⭐ {product.seller.ratingAverage} ({product.seller.ratingCount})</span>
          )}
        </p>
      </div>
    </Link>
  );
}
