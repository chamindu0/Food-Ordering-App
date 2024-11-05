import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import classes from './header.module.css';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  const { cart } = useCart();

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>
        <a href="https://fontmeme.com/sinhala/"><img src="https://fontmeme.com/permalink/241104/c8bb474dcab8f70a639dbb929df4ce4f.png" alt="sinhala" border="0"/></a> <a href="https://fontmeme.com/comic-fonts/">
         
         <img src="https://fontmeme.com/permalink/240718/ec68e0c7bd706468b0c46a6ca9748b5e.png" alt="comic-fonts" border="0"/></a>
        </Link>

        
        <nav>
          <ul>
            {user ? (
              <li className={classes.menu_container}>
                <Link to="/dashboard">{user.name}</Link>
                <div className={classes.menu}>
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">Orders</Link>
                  <a onClick={logout}>Logout</a>
                </div>
              </li>
            ) : (
              <Link to="/login">Login</Link>
            )}

            <li>
              <Link to="/cart">
                Cart
                {cart.totalCount > 0 && (
                  <span className={classes.cart_count}>{cart.totalCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
