import Card from "../../components/card";
import React, { use, useEffect, useState } from "react";
import Bannerad from "../../components/bannerad";
import Layoutt from "../Layout";
import supabase from "../../../supabase";
import { useAuthContext } from "@/context";
// import { useRouter } from "next/router";
import { useUser } from "@/store";

export default function skillclass() {
  // const router = useRouter();
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<any[] | null>(null);

  const userStore = useUser((state) => state.user);
  // console.log("userstore", userStore);

  async function getSchool() {
    try {
      let { data, error } = await supabase
        .from("School")
        .select("*")
        .match({ State: userStore.State, District: userStore.District })


      setUserData(data);
      if (error) throw error;
    } catch (error) {
      console.log("Caught Error:", error);
    }
  }

  useEffect(() => {
    if (userStore && userStore.State) {
      getSchool();
    }
  }, [userStore]);

  if (!user.email) {
    return (
      <div>
        loading/no user found ,if it is taking longer than usual ,please{" "}
        <a href="signup">signup</a>__ /__<a href="/login">signin</a>.
      </div>
    );
  }

  return (
    <>
      <Layoutt>
        <Bannerad />

        {userData &&
          userData.map(
            (
              school: { schoolname: string; rating: number; link: string,img:string },
              index: number
            ) => (
              <Card
                key={index} // Ensure unique key for each Card
                name={school.schoolname}
                rating={school.rating}
                link={`/school/${school.schoolname}`}
                imgsrc={
                  school.img ||
                  "https://images.unsplash.com/photo-1612835240301-5b5b8f7e1e8e"
                }
              />
            )
          )}
      </Layoutt>
    </>
  );
}
