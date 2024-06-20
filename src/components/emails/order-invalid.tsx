/* eslint-disable react/no-unescaped-entities */
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderNotifProps {
    username: string
}

const InvalidOrder = ({ username }: OrderNotifProps) => {

    return (
        <Html key={username}>
            <Head />
            <Preview>Hey {username} your order is invalid.</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-slate-50 font-sans">
                    <Container className="border bg-white border-solid border-[#eaeaea] text-gray-600 rounded-2xl shadow-2xl my-[60px] mx-auto px-10 w-[1000px]">
                        <Heading className="font-normal">
                            <Text className='text-lg'>Invalid Order Notification</Text>
                        </Heading>
                        <Text className="text-[14px] leading-[24px]">
                            Hello <strong className='text-yellow-500'>{username}</strong>,
                        </Text>
                        <Text className="text-[14px] leading-[24px]">
                            Thank you for choosing SonicNode for your Minecraft server hosting. We regret to inform you that your order is invalid and cannot be processed at this time.
                        </Text>
                        <Text className="text-[14px] leading-[24px]">
                            If you believe this is a mistake or if you have any questions, please contact us by replying to this email.
                        </Text>
                        <Text className='text-[14px] leading-[24px]'>
                            Regards,<br />
                            <strong className='text-gray-700'>SonicNode Team</strong>
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    </Container>

                </Body>
            </Tailwind>
        </Html>
    );
};

export default InvalidOrder;