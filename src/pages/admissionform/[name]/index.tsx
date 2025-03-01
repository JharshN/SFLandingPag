import React from "react";
import { useForm, Controller } from "react-hook-form";
import supabase from "../../../../supabase";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Nouser from "@/components/Nouser";
// import Shikshacoin from "@/components/shikshacoinpopup";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Radio,
  RadioGroup,
  HStack,
  Stack,
  CardBody,
  Card,
} from "@chakra-ui/react";
import { useAuthContext } from "@/context";
import { useUser } from "../../../store";
import Shikshacoin from "@/components/shikshacoinpopup";

// assciate school id with the form filled by the student

function admissionform() {
  const { user } = useAuthContext();
  const useUse = useUser((state) => state.user);

  const form = useForm();
  const toast = useToast();
  const router = useRouter();
  const { name } = router.query;

  const { register, handleSubmit, control } = form;

  if (useUse && useUse.Coins <= 0) {
    setTimeout(() => {
      router.push("/school");
    }, 5000);
    return (
      <Shikshacoin
        title="Shiksha Coin"
        message="You don't have enough shiksha coin to fill this form"
        link="/school"
      />
    );
  }

  // const [showShikshacoin, setShowShikshacoin] = useState(false);
  const handleSubmitt = () => {
    toast({
      title: "Form submitted!",
      description: "Thank you for your Form",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    router.push("/successAdmission");
    // setShowShikshacoin(true);
  };

  const updateCoins = async () => {
    let coin = useUse && useUse.Coins - 5;
    const { error } = await supabase.from("Student").update({ Coins: coin }).eq("user_id", user.id);
    console.log(coin);
    console.log(error);
    
  };


  const onSubmit = async (data: any) => {
    const { error } = await supabase
      .from("admissionform")
      .insert([
        { ...data, email: user.email, user_id: user.id, instituteid: name },
      ]);

     

    if (error) {
      toast({
        title: "error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
         updateCoins();
      handleSubmitt();
    }
  };

  if (!user.email) {
    return <Nouser />;
  }

  return (
    <>
      <Stack spacing="4">
        {/* {showShikshacoin && <Shikshacoin />} */}

        <Card variant="outline">
          <CardBody>
            <Heading size="md" fontSize="26px">
              Let's Begin the journey of Education{" "}
            </Heading>
            <br />
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                {...register("name", {
                  required: true,
                })}
                name="name"
                placeholder="name as per your documents"
              />
            </FormControl>
            <br />
            <FormControl isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="number"
                {...register("mobilenumber", { required: true })}
                name="mobilenumber"
                placeholder="+91..."
              />
            </FormControl>
            <br />
            <FormControl isRequired>
              <FormLabel>Percentage</FormLabel>
              <Input
                {...register("percentage", { required: true })}
                name="percentage"
                placeholder="Last years percentage/grade"
              />
            </FormControl>
            <br />{" "}
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                {...register("address", { required: true })}
                name="address"
                placeholder="Address"
              />
            </FormControl>
            <br />
            <FormControl isRequired>
              <FormLabel>Standard/Exam </FormLabel>
              <Input
                {...register("standard", { required: true })}
                name="standard"
                placeholder="standard/if for more than 12  than write name of exam for which you are preparing"
              />
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Stream</FormLabel>
              <Input
                {...register("stream", { required: false })}
                name="stream"
                placeholder="write science/commerce/arts if you are in 11th or 12th"
              />
            </FormControl>
            <br />
            <FormControl as="fieldset">
              <FormLabel as="legend">Board</FormLabel>
              <Controller
                name="Board"
                control={control}
                defaultValue="State"
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <HStack spacing="24px">
                      <Radio value="CBSE">CBSE</Radio>
                      <Radio value="ICSE">ICSE</Radio>
                      <Radio value="State">State Board</Radio>
                    </HStack>
                  </RadioGroup>
                )}
              />
            </FormControl>
            <br />
            <FormControl as="fieldset">
              <FormLabel as="legend">Medium</FormLabel>
              <Controller
                name="medium"
                control={control}
                defaultValue="Native"
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <HStack spacing="24px">
                      <Radio value="Hindi">Hindi Medium</Radio>
                      <Radio value="English">English Medium</Radio>
                      <Radio value="Native">Native</Radio>
                    </HStack>
                  </RadioGroup>
                )}
              />
            </FormControl>
            <br />
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}

export default admissionform;
