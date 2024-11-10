import FormField from "@/components/FormField";
import { devLog } from "@/utils/apiUtils";

import { UsersIcon,Library } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
export default function StreamForm({onSubmit,onCancel,currentData}) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      number_seats: "",
    },
  });

  useEffect(() => {
    if(currentData) reset(currentData)
  },[currentData])

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="form">
    <div className="form-container">
        <h3 className="form__title">{currentData ?"Edit Stream" :  "Create Streams"}</h3>
        <FormField label={"Stream Name"}
        icon={Library}
        error = {errors?.name?.message}
        >
            <input {...register("name",{
                required : "Name is required",
                minLength : {
                    value : 2,
                    message : 'Should be of atleast 2 characters'
                }
            })} className="form__input"
            placeholder="Computer Science and Technology"/>
        </FormField>

        <FormField label={"Number of seats"}
        icon={UsersIcon}
        error = {errors?.number_seats?.message}
        >
            <input {...register("number_seats",{
                required : "Number of seats is required",
            })} className="form__input" placeholder="60"/>
        </FormField>

        <div className="form__actions">
                    <button type="submit" disabled={isSubmitting} className="button button--primary button--icon">
                      {currentData ? "Confirm Edit" : "Create Steam"} 
                      
                        </button>

                        <button type="button" className="button button--secondary " onClick={onCancel}>
                        Cancel
                        </button>
                </div>
    </div>
  </form>
  )
}
