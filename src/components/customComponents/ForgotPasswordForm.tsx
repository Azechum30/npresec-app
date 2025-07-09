'use client'

import {Form} from "../ui/form";
import { useForm } from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import {useTransition} from "react";
import {forgotPasswordActions} from "@/lib/server-only-actions/authenticate";
import {toast} from "sonner";


const ResetPasswordSchema = z.object({
    email:z.string().email()
})

type ResetPasswordType = z.infer<typeof ResetPasswordSchema>

export default function ForgotPassword() {
    const form = useForm<ResetPasswordType>({
        resolver:zodResolver(ResetPasswordSchema),
        defaultValues: {email: ""}
    } )

    const [isPending, startTransition] = useTransition()

    const handleSubmit =(value:ResetPasswordType)=>{
        startTransition(async()=>{
            const promiseResult = await forgotPasswordActions(value);

            if(promiseResult.error){
                toast.error(promiseResult.error)
                return;
            }

            toast.success("A password reset link has been sent to your email. Please check your inbox.")

        })
    }
    return <div className="flex justify-center items-center w-full h-full">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-md p-6 rounded-md shadow-2xl bg-inherit space-y-4 bg-gradient-to-br from-orange-50 via-white to-orange-100 ">
                <h1 className="text-lg font-medium">Forgot Password</h1>
                <InputWithLabel<ResetPasswordType>
                    name="email"
                    fieldTitle="Email"
                    placeholder="Enter your email"
                    type="email"
                    className="placeholder:text-xs font-normal"
                    schema={ResetPasswordSchema}

                />

                <LoadingButton loading={isPending}>
                    Reset
                </LoadingButton>
            </form>
        </Form>
    </div>
}