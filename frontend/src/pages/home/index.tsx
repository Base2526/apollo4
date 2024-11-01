import "./index.less"

import React, { useState, useEffect } from 'react';
import { Input, Select, List, Pagination, message, Skeleton, Button } from 'antd';
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
  const [pageSize, setPageSize] = useState(50); 

  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const { loading: loadingProducts, data: dataProducts, error: errorProducts, refetch: refetchProduct } = useQuery(guery_products, {
    context: { headers: getHeaders(location) },
    fetchPolicy: 'cache-first',
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

  // useEffect(()=>{
  //   console.log("selectedFilter: ", selectedFilter)
  // }, [selectedFilter])

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredProducts(products); // Show all products if no filter is selected
    } else {
      const filtered = products.filter((product) =>
        selectedFilters.some((filter) => {
          switch (filter) {
            case 1:
              return !_.isEmpty(product.current.package_front);
            case 2:
              return !_.isEmpty(product.current.package_back);
            case 3:
              return product.current.product_type.includes(1);
            case 4:
              return product.current.product_type.includes(4);
            default:
              return false;
          }
        })
      );
      setFilteredProducts(filtered);
      // console.log("setFilteredProducts :", filtered)
    }
    setCurrentPage(1); // Reset to the first page when filtering
  }, [selectedFilters, products]);
  

  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase();
    const filtered = products.filter(product =>
      product.current.name.toLowerCase().includes(searchValue)
    );

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // const handleFilterChange = (value: number) => {
  //   setSelectedFilter(value); // Save selected filter
  //   const filtered = products.filter((product) => {
  //     switch (value) {
  //       case 1:
  //         return !_.isEmpty(product.current.package_front);
  //       case 2:
  //         return !_.isEmpty(product.current.package_back);
  //       case 3:
  //         return product.current.product_type.includes(1);
  //       case 4:
  //         return product.current.product_type.includes(4);
  //       default:
  //         return true;
  //     }
  //   });
  //   setFilteredProducts(filtered);
  //   setCurrentPage(1);
  // };

  const handleFilterChange = (value: number) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(value)
        ? prevFilters.filter((filter) => filter !== value)
        : [...prevFilters, value]
    );
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
          placeholder="ค้าหาสินค้า"
          onSearch={handleSearch}
          style={{width: 300}}/>
      </div>
      <div style={{display: 'flex', flexDirection:'row', marginBottom: '10px'}}>
        <Button
          style={{
            borderRadius: 0,
            backgroundColor: selectedFilters.includes(1) ? '#1890ff' : undefined,
            color: selectedFilters.includes(1) ? '#fff' : undefined
          }}
          onClick={() => handleFilterChange(1)}
        >
          แผนหน้า
        </Button>
        <Button
          style={{
            borderRadius: 0,
            backgroundColor: selectedFilters.includes(2) ? '#1890ff' : undefined,
            color: selectedFilters.includes(2) ? '#fff' : undefined
          }}
          onClick={() => handleFilterChange(2)}
        >
          แผนหลัง
        </Button>
        <Button
          style={{
            borderRadius: 0,
            backgroundColor: selectedFilters.includes(3) ? '#1890ff' : undefined,
            color: selectedFilters.includes(3) ? '#fff' : undefined
          }}
          onClick={() => handleFilterChange(3)}
        >
          เอกสิทธิพิเศษ
        </Button>
        <Button
          style={{
            borderRadius: 0,
            backgroundColor: selectedFilters.includes(4) ? '#1890ff' : undefined,
            color: selectedFilters.includes(4) ? '#fff' : undefined
          }}
          onClick={() => handleFilterChange(4)}
        >
          Power ship
        </Button>
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
          showTotal={(total) => `Total ${total} items`}  // Displays total count
          pageSizeOptions={["50", "100", "250"]}
          style={{ marginTop: 20, marginBottom: 20}}
        />
      }
    </div>
  );
};

export default ProductList;