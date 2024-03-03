export default function SearchInput({ searchTerm, onSearch }: {
  searchTerm: string,
  onSearch: any,
}) {
  return (
    <input type="text" placeholder="검색어를 입력해주세요" onChange={onSearch} value={searchTerm}
      className="p-2 border border-gray-300 rounded-md"
    />
  )
}