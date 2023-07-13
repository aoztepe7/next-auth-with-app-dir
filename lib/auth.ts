import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type ServiceResponse<T> = {
    body?: T;
    header: Header;
}

type Header = {
    requestId: string;
    success: boolean;
    responseTime: string;
}

class LoginRequest {
    agency?: string;
    user?: string;
    password?: string;
    constructor(pAgency: string, pUser: string, pPassword: string) {
        this.agency = pAgency;
        this.user = pUser;
        this.password = pPassword;
    }
};

type LoginResponse = {
    token: string;
    expiresOn: string;
    tokenId: number;
    userInfo: UserInfo;
    loggedInWithMasterKey: boolean;
}

type UserInfo = {
    mainAgency: MainAgency;
    agency: Agency;
    office: Office;
    operator: Operator;
    market: Market;
    webSiteId: number;
    id: string;
}

type MainAgency = {
    ownAgency: boolean;
    useOwnWebSettings: boolean;
    sendFlightInfoSms: boolean;
    allowUnpaidRes: number;
    aceExport: boolean;
    allowNon3DPayments: boolean;
    bonusUseSysParam: boolean;
    bonusUserSeeAgencyW: boolean;
    bonusUserSeeOwnW: boolean;
    allowAddCredit: boolean;
    showAgencyLogoOnB2b: boolean;
    hideInstallmentTable: boolean;
    hideAgencyCreditOnWeb: boolean;
    force2FactorAuth: boolean;
    location: number
}

type Agency = {
    id: number;
    code: string;
}

type Office = {
    name: string;
    code: string;
}

type Operator = {
    name: string;
    code: string;
}

type Market = {
    code: string;
    name: string;
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                var request = new LoginRequest("test", "test", "test")
                const { data, status } = await axios.post<ServiceResponse<LoginResponse>>(
                    'apiUrl',
                    request,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    },
                );

                if (data && data.header.success && data.body?.userInfo) {
                    return {
                        id: data.body?.userInfo.id,
                        email: data.body?.userInfo.office.code,
                        name: data.body?.userInfo.operator.code,
                        randomKey: data.body.tokenId,
                    };
                }
                //return data.body.userInfo as any;
                else
                    return null;
            },
        }),
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    randomKey: token.randomKey,
                },
            };
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    randomKey: u.randomKey,
                };
            }
            return token;
        },
    }
};