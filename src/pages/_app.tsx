import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import SideBar from "~/components/sideBar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
<> 
    <SideBar>
      <Component {...pageProps} />
    </SideBar>
</>
    )
};

export default api.withTRPC(MyApp);
