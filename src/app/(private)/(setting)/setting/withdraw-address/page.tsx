/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { withdrawAddressSchema, WithdrawAddressSchema } from "@/schema";
import { updateWithdrawAddress } from "@/action/withdraw";
import { toast } from "sonner";
import { countries } from "@/data/countries";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function AgentWithdrawAddress() {
  const agent: any = useCurrentUser();

  const [pending, startTr] = useTransition();
  const [selectedCountry, setSelectedCountry] = useState<
    keyof typeof countries | ""
  >("");

  const form = useForm<WithdrawAddressSchema>({
    defaultValues: {
      city: "",
      country: "",
      postOffice: "",
      storeName: "",
    },
    resolver: zodResolver(withdrawAddressSchema),
  });

  const onSubmit = async (data: WithdrawAddressSchema) => {
    startTr(() => {
      const asyncAction = async () => {
        const response = await updateWithdrawAddress(data);
        if (response.error) throw new Error(response.error);
        return response.success;
      };

      toast.promise(asyncAction(), {
        loading: "Saving...",
        success: () => "Withdraw address updated",
        error: (err) => err.message,
      });
    });
  };

  useEffect(() => {
    if (agent.withdrawAddress.country) {
      setSelectedCountry(agent.withdrawAddress.country);
    }
    if (agent.withdrawAddress) {
      form.reset({
        city: agent.withdrawAddress.city || "",
        country: agent.withdrawAddress.country || "",
        postOffice: agent.withdrawAddress.postOffice || "",
        storeName: agent.withdrawAddress.storeName || "",
      });
    }
  }, [agent]);

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Withdraw Address</CardTitle>
        <CardDescription>
          Withdraw Address is your Uniqe indentity that will be used to find out
          you to users.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    disabled={pending}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedCountry(val as keyof typeof countries);
                      form.setValue("city", ""); // reset city
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(countries).map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    disabled={pending || !selectedCountry}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={"Select city"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(countries[selectedCountry] || []).map((city: any) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Office</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      placeholder="Post Office"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      placeholder="Store Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={pending} type="submit" className="w-full">
              Save Address
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
