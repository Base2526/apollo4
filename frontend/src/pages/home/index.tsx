import "./index.less"

import React, { useState, useEffect, } from 'react';
import { Input, Select, List, Pagination, message, Skeleton, Button, Radio, RadioChangeEvent } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from "lodash"
import { useQuery } from '@apollo/client';

import { addCart, 
        removeCart, 
        add_cart_plan_front, 
        removeCart_plan_front,
        add_cart_plan_back,
        removeCart_plan_back } from '@/stores/user.store';
import HomeCard from "@/pages/home/HomeCard"
import { ProductItem } from "@/interface/user/user"
import { guery_products } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';

import { useAppContext } from '@/AppContext';

const { Option } = Select;
const { Search } = Input;

const ProductList: React.FC = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { homeFilter, updateProductType, updateOption } = useAppContext();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); 

  const [selectedRadioFilter, setSelectedRadioFilter] = useState<number>(homeFilter.filter.product_type);
  const [selectedFilters, setSelectedFilters] = useState<number[]>(homeFilter.filter.option);

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
          setFilteredProducts((prevItems) =>{
            if(Array.isArray(prevItems)){
              // return [...prevItems, e]

              switch (selectedRadioFilter) {
                case 1: // แผนหน้า
                  return _.includes(e.current.product_type, 1) ? [...prevItems, e] : prevItems;
                case 2: // แผนหลัง
                  return _.includes(e.current.product_type, 2) ? [...prevItems, e] : prevItems;
                default:
                  return [];
              }
            }else{
              // return [e]

              switch (selectedRadioFilter) {
                case 1: // แผนหน้า
                  return _.includes(e.current.product_type, 1) ? [e] : [];
                case 2: // แผนหลัง
                  return _.includes(e.current.product_type, 2) ? [e] : [];;
                default:
                  return [];
              }
            }
          });
        });
      }
    }
  }, [dataProducts, loadingProducts]);

  useEffect(() => {
    if (selectedFilters.length === 0) {
      const filtered = products.filter((product) => {
        switch (selectedRadioFilter) {
          case 1: // แผนหน้า
            return _.includes(product.current.product_type, 1);
          case 2: // แผนหลัง
            return _.includes(product.current.product_type, 2);
          default:
            return false;
        }
      });
      setFilteredProducts(filtered);
    }else{
      const filtered = products.filter((product) => {
        switch (selectedRadioFilter) {
          case 1: // แผนหน้า
            return _.includes(product.current.product_type, 1);
          case 2: // แผนหลัง
            return _.includes(product.current.product_type, 2);
          default:
            return false;
        }
      });

      setFilteredProducts(filtered.filter((filter) =>
        {
          switch (selectedRadioFilter) {
            // แผนหน้า
            case 1: {
              return selectedFilters.every((element) => filter.current.option_front.includes(element));
            }
            // แผนหลัง
            case 2: {
              return selectedFilters.every((element) => filter.current.option_back.includes(element));// 
            }
          }
        }
      ));
    }
    setCurrentPage(1);
  }, [selectedFilters, products]);
  
  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase();
    const filtered = products.filter(product =>
      product.current.name.toLowerCase().includes(searchValue)
    );

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    const selectedValue = e.target.value;
    setSelectedRadioFilter(selectedValue);
    setSelectedFilters([])

    updateProductType(selectedValue)
    updateOption([])

    // Filter products based on selected radio option
    const filtered = products.filter((product) => {
      switch (selectedValue) {
        case 1: // แผนหน้า
          return _.includes(product.current.product_type, 1);
        case 2: // แผนหลัง
          return _.includes(product.current.product_type, 2);
        default:
          return true;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: number) => {
    setSelectedFilters((prevFilters) =>{
      let newOptions = prevFilters.includes(value) ? prevFilters.filter((filter) => filter !== value): [...prevFilters, value];
      updateOption(newOptions)
      return newOptions;
    });
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
        {/*  แผนหน้า, แผนหลัง  */}
        {/* Radio buttons for แผนหน้า and แผนหลัง */}
        <Radio.Group onChange={handleRadioChange} value={selectedRadioFilter}>
          <Radio value={1}>แผนหน้า</Radio>
          <Radio value={2}>แผนหลัง</Radio>
        </Radio.Group>
        <Button
          style={{
            borderRadius: 0,
            backgroundColor: selectedFilters.includes(1) ? '#1890ff' : undefined,
            color: selectedFilters.includes(1) ? '#fff' : undefined
          }}
          onClick={() => handleFilterChange(1)}
        >
          เอกสิทธิพิเศษ
        </Button>
        <Button
          style={{
            borderRadius: 0,
            backgroundColor: selectedFilters.includes(2) ? '#1890ff' : undefined,
            color: selectedFilters.includes(2) ? '#fff' : undefined
          }}
          onClick={() => handleFilterChange(2)}
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
                productType={homeFilter.filter.product_type}
                onClick={()=>{
                  navigate(`/view?v=${item._id}`, { state: { _id: item._id } });
                }}
                onAddToCart={()=>{
                  // dispatch(addCart(item));
                  dispatch( homeFilter.filter.product_type === 1 
                            ? add_cart_plan_front(item) 
                            : add_cart_plan_back(item)
                          )
                  message.success('Add to cart!');
                }}
                onDeleteForCart={()=>{
                  // dispatch(removeCart(item._id));
                  dispatch( homeFilter.filter.product_type === 1 
                            ? removeCart_plan_front(item._id) 
                            : removeCart_plan_back(item._id)
                          )
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