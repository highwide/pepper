import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Pepper">
    <h1>Pepper</h1>
    <p>
      <Link href="/koshohyo/new">
        <a>作る</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
