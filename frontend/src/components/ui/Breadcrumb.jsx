import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-text-secondary py-3 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <Link
            to="/"
            className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-[15px] text-accent">home</span>
            <span>Trang chủ</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li className="text-border-custom flex items-center">
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
              </li>
              <li>
                {isLast || !item.to ? (
                  <span
                    className="font-semibold text-primary"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    className="hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
