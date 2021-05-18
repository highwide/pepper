import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>呼称表ジェネレーター</h1>
    <p>
      <Link href="/koshohyo/new">
        <a>作る</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
