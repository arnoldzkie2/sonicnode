/* eslint-disable react/no-unescaped-entities */
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderNotifProps {
  username: string
  sonic_amount: number
}

export const OrderVerified = ({ username, sonic_amount }: OrderNotifProps) => {

  return (
    <Html key={username}>
      <Head />
      <Preview>Hey {username} your order has been completed.</Preview>
      <Tailwind>
        <Body className="grid place-items-center bg-slate-50 font-sans">
          <Container className="border bg-white border-solid border-[#eaeaea] text-gray-600 rounded-2xl shadow-2xl my-[60px] mx-auto px-10 w-[1000px]">
            <Heading className="font-normal">
              <Text className='text-lg'>Order Completed</Text>
            </Heading>
            <Text className="text-[14px] leading-[24px]">
              Hello <strong className='text-yellow-500'>{username}</strong>,
            </Text>
            <Text className="text-[14px] leading-[24px]">
              Thank you for choosing SonicNode for your Minecraft server hosting. We are pleased to inform you that your order has been verified successfully. You have received <span className='font-bold'>{sonic_amount}</span> sonic coins.
            </Text>
            <Text className="text-[14px] leading-[24px]">
              For further details regarding your order, please visit your SonicNode account dashboard.
            </Text>
            <Text className='text-[14px] leading-[24px]'>
              Happy gaming,<br />
              <strong className='text-gray-700'>SonicNode Team</strong>
            </Text>
            <Link href='https://sonicnode.xyz' className='text-yellow-500 underline'>sonicnode.xyz</Link>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>

        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderVerified;