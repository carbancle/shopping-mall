import { useAppSelector } from "../../store"
import dayjs from "dayjs";

export default function HistoryPage() {
  const history = useAppSelector(state => state.user?.userData?.history);

  return (
    <section>
      <div className="text-center m-7">
        <h2 className="text-2xl">History</h2>
      </div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="border-[1px]">
          <tr>
            <th>Payment Id</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Date Of Purchase</th>
          </tr>
        </thead>
        <tbody>
          {history?.map((item) => (
            <tr key={item.id} className="border-b">
              <td>{item.id}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{dayjs(item.dateOfPurchase).format("YYYY-MM-DD HH:mm:ss")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}