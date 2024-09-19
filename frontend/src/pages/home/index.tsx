import "./index.less"

import React, { useState, useEffect } from 'react';
import { Input, Select, List, Pagination, Card, message } from 'antd';
import type { PaginationProps } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import _ from "lodash"
import { useQuery } from '@apollo/client';

import { addCart, removeCart } from '@/stores/user.store';
import  { DefaultRootState } from '@/interface/DefaultRootState';
import ProductCard from "./ProductCard"

import { ProductItem } from "@/interface/user/user"

import { guery_products } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';

const { Option } = Select;
const { Search } = Input;

const ProductList: React.FC = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); 

  const { loading: loadingProducts, data: dataProducts, error: errorProducts, refetch: refetchProduct } = useQuery(guery_products, {
    context: { headers: getHeaders(location) },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: false,
  });

  if (errorProducts) {
      handlerError(props, errorProducts);
  }

  useEffect(() => {
    if (!loadingProducts && dataProducts?.products) {
      setProducts([]);
      setFilteredProducts([]);
      if (dataProducts.products.status) {
        _.map(dataProducts.products.data, (e, key) => {
          setProducts((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
          setFilteredProducts((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
        });
      }
    }
  }, [dataProducts, loadingProducts]);

  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase();
    const filtered = products.filter(product =>
      product.current.name.toLowerCase().includes(searchValue)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleFilterChange = (value: string) => {
    // const filtered = value
    //   ? products.filter(product => product.type === parseInt(value) )
    //   : products;
    // setFilteredProducts(filtered);
    setFilteredProducts(products);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  const handlePaginationChange: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: '10px' }}>
        <Search
          placeholder="Search products"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by type"
          onChange={handleFilterChange}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="1">Front</Option>
          <Option value="2">Back</Option>
        </Select>
      </div>

      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={paginatedProducts}
        renderItem={item => (
          <List.Item>
            {/* <Card title={item.name}>
              Type: {item.type}
            </Card> */}

            <ProductCard
              _id={item._id}
              title={item.current.name}
              imageUrl="https://via.placeholder.com/300"
              details={item.current.detail}
              price={item.current.price}
              onClick={()=>{
                navigate(`/view?v=${item._id}`, { state: {  _id: item._id } });
              }}
              onAddToCart={()=>{
                dispatch(addCart(item));
                message.success('Add to cart!');
              }}
              onDeleteForCart={()=>{
                dispatch(removeCart(item._id));
                message.warning('Delete form cart!');
              }}
              onBuy={()=>{
                navigate("/cart"); 
              }}
            />
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredProducts.length}
        onChange={handlePaginationChange}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default ProductList;