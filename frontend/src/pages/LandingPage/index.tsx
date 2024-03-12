import { useEffect, useState } from "react";
import CardItem from "./Sections/CardItem";
import CheckBox from "./Sections/CheckBox";
import RadioBox from "./Sections/RadioBox";
import SearchInput from "./Sections/SearchInput";
import { axiosInstance } from "../../utils/axios";
import { LandingStatus } from "../../interface/LandingStatus";
import { IProduct } from "../../interface/Product";
import { continents, prices } from "../../utils/filterData";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const limit = 4;
  const [products, setProducts] = useState<IProduct[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    continents: [],
    price: [],
  })

  const fetchProducts = async ({
    skip, limit, loadMore = false, filters = {}, searchTerm = "",
  }: LandingStatus) => {
    const params = {
      skip,
      limit,
      filters,
      searchTerm
    }

    try {
      const response = await axiosInstance.get('/products', { params })

      if (loadMore) {
        setProducts([...products, ...response.data.products])
      } else {
        setProducts(response.data.products);
      }
      setHasMore(response.data.hasMore);

    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchProducts({ skip, limit });
  }, [])

  const handleLoadMore = () => {
    const body = {
      skip: skip + limit,
      limit,
      loadMore: true,
      filters,
      searchTerm,
    }
    fetchProducts(body);
    setSkip(skip + limit);
  }

  const handleFilters = (newFilterData: object, category: string) => {
    const newFilters: any = { ...filters };
    console.log("필터데이터 정보?", newFilterData);
    newFilters[category] = newFilterData;
    if (category === "price") {
      const priceValues = handlePrice(newFilterData);
      console.log("price에서 filterData?", newFilterData);
      newFilters[category] = priceValues;
    }

    showFilterResult(newFilters);
    setFilters(newFilters);
  }

  const handlePrice = (value: object) => {
    let array: number[] = [];

    for (let key in prices) {
      if (prices[key]._id === parseInt(String(value), 10)) {
        array = prices[key].array

      }
    }
    return array;
  }

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const body = {
      skip: 0,
      limit,
      filters,
      searchTerm: e.target.value
    }
    setSkip(0);
    setSearchTerm(e.target.value);
    fetchProducts(body);
  }

  const showFilterResult = (filters: object) => {
    const body = {
      skip: 0,
      limit,
      filters,
      searchTerm,
    }
    fetchProducts(body);
    setSkip(0);
  }

  return (
    <section>
      <div className="text-center m-7">
        <h2 className="text-2xl">여행 상품 사이트</h2>
      </div>
      {/* Filter */}
      <div className="flex gap-3">
        <div className="w-1/2">
          <CheckBox continents={continents} checkedContinents={filters.continents} onFilters={(filters: object) => handleFilters(filters, "continents")} />
        </div>
        <div className="w-1/2">
          <RadioBox prices={prices} checkedPrice={filters.price} onFilters={(filters: object) => handleFilters(filters, "price")} />
        </div>
      </div>
      {/* Search */}
      <div className="flex justify-end mb-3">
        <SearchInput searchTerm={searchTerm} onSearch={handleSearchTerm} />
      </div>
      {/* Card */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product: IProduct) =>
          <CardItem product={product} key={product._id} />
        )}
      </div>
      {/* LoadMore */}
      {hasMore &&
        <div className="flex justify-center mt-5">
          <button onClick={handleLoadMore}
            className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500"
          >
            더 보기
          </button>
        </div>
      }
      <div><Link to={"/test"}>Test Page</Link></div>
    </section>
  )
}