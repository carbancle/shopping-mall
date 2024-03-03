import { IPrice } from "../../../interface/Filter";

export default function RadioBox({ prices, checkedPrice, onFilters }: {
  prices: Array<IPrice>,
  checkedPrice: Array<number>,
  onFilters: any,
}) {
  return (
    <div className="p-2 mb-3 bg-gray-100 rounded-md">
      {prices?.map((price) =>
        <div key={price._id}>
          <input type="radio" id={String(price._id)} value={price._id}
            checked={checkedPrice === price.array} onChange={(e) => onFilters(e.target.value)}
          />{" "}
          <label htmlFor={String(price._id)}>{price.name}</label>
        </div>
      )}
    </div>
  )
}