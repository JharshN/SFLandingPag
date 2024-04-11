import Card from "../../components/card";
import React, { useEffect, useState } from "react";
import Bannerad from "../../components/bannerad";
import Layoutt from "../Layout";
import supabase from "../../../supabase";
import { useAuthContext } from "@/context";
// import { useRouter } from "next/router";
import { useUser } from "@/store";
import { Toast } from "@chakra-ui/react";

export default function skillclass() {
  // const router = useRouter();
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<any[] | null>(null);
  const userStore = useUser((state) => state.user);
  

  async function getSchool() {
    try {
      let { data, error } = await supabase
        .from("onlineform")
        .select("*")

        // .filter("Standard", "contains", "Kg");
      // .match({ State: userStore.Standard, District: userStore.medium });

      // .match({ State: userStore.State, District: userStore.city });

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.log("Caught Error:", error);
    }
  }

  useEffect(() => {
    getSchool();
  }, [user]);

  if (!user.email) {
    return Toast({
      title: "Error.",
      description: "Please Login to access this page",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <>
      <Layoutt>
        <Bannerad />

        {userData &&
          userData.map(
            (
              onlineplatform: {
                coachingname: string;
                ratingofcoaching: number; // Ensure unique key for each Card
                link: string;
              },
              index: number
            ) => (
              <Card
                key={index} // Ensure unique key for each Card
                name={onlineplatform.coachingname}
                rating={onlineplatform.ratingofcoaching}
                link={`/onlineplatform/${onlineplatform.coachingname}`}
                imgsrc={
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
              />
            )
          )}
      </Layoutt>
    </>
  );
}
