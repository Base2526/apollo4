import "./index.less"

import React, { useState, useEffect } from 'react';
import { Input, Select, List, Pagination, message, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from "lodash"
import { useQuery } from '@apollo/client';

import { addCart, removeCart } from '@/stores/user.store';
import HomeCard from "@/pages/home/HomeCard"
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
  const [pageSize, setPageSize] = useState(20); 

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
        _.map(dataProducts.products.data, (e) => {
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
    if(value === undefined){
      setFilteredProducts(products);
    }else{
      const filtered = products.filter(product =>{
        return product.current.plan.includes( parseInt(value) )
      });
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); // Reset to the first page when filtering
  };

  // Function to handle page number and page size changes
  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: '10px' }}>
        <Search
          placeholder="Search products name"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Filter by plan"
          onChange={handleFilterChange}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="1">Plan front</Option>
          <Option value="2">Plan back</Option>
        </Select>
      </div>

      <Skeleton loading={loadingProducts} active>
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={paginatedProducts}
          renderItem={item => (
            <List.Item  className={`list-item-product-card`}>
              <HomeCard
                product= {item}
                onClick={()=>{
                  navigate(`/view?v=${item._id}`, { state: { _id: item._id } });
                }}
                onAddToCart={()=>{
                  dispatch(addCart(item));
                  message.success('Add to cart!');
                }}
                onDeleteForCart={()=>{
                  dispatch(removeCart(item._id));
                  message.warning('Delete from cart!');
                }}
                onBuy={()=>{
                  navigate("/cart"); 
                }}
              />
            </List.Item>
          )}
        />
      </Skeleton>

      { 
        filteredProducts.length > 20 &&
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredProducts.length}
          onChange={handlePaginationChange}
          style={{ marginTop: 20, marginBottom: 20}}
        />
      }
      
    </div>
  );
};

export default ProductList;