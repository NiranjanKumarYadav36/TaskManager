import React, { useEffect, useState } from 'react';
import AxiosClient from '../../components/ApiClient/AxiosClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Header() {
  const [username, setUsername] = useState<string | null>("P")
  const navigate = useNavigate()

  useEffect(() => {
    const userDetails = async () => {
      const resposne = await AxiosClient.get("/user")
      if (resposne) {
        setUsername(resposne.data.message)
        console.log(resposne.data.message);

      }
    }
    userDetails()

  }, [])

  const handleLogout = async () => {
    try {
      const response = await AxiosClient.post("/logout")
      if (response) {
        navigate("/")
        toast.success(response.data.message)
      }
    } catch (error: any) {
      if (error.response && error.response.status == 500) {
        toast.error(error.response.data.message)
      }
    }
  }

  return (
    <div className='bg-gray-300 flex p-4 justify-between items-center'>
      <div className='font-bold text-2xl'>
        <Link to={"/homepage"}>MyTask</Link>
      </div>
      <div className=''>
        <DropdownMenu>
          <DropdownMenuTrigger className='focus:outline-none'>
            <Avatar>
              <AvatarFallback>
                {username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              {username}
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Header;