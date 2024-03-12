import axios from "axios"
import { useState } from "react";

function TestPage() {
  const [loading, setLoading] = useState(false);
  const [str, setStr] = useState("");

  const url = import.meta.env.VITE_SERVER_URL + '/route-test';

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get(url);
    console.log(res);
    setLoading(false);
    const data = res.data;
    console.log(data);
    setStr(data);
  }

  return (
    <div>
      <h1>Route Test!!!</h1>
      <button disabled={!!str || loading} onClick={fetchData}>
        {loading ? "loading..." : 'fetch Data'}
      </button>
      <p>Data: {str || 'none'}</p>
    </div>
  )
}

export default TestPage