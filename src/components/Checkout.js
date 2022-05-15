import React from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useContext } from "react"

import { UserContext } from "../contexts/UserContext"

export default function Checkout() {
    const { userInfo } = useContext(UserContext)
    const { email, token, gamesInCart } = userInfo
    const navigate = useNavigate()

    const URL = `${process.env.REACT_APP_API_URL}/checkout`

    let totalPrice = 0
    let fixedPrice

    let gamesInCartID = []
    for (let i = 0; i < gamesInCart.length; i++) {
        gamesInCartID.push(gamesInCart[i].id)
    }

    function buyGames(e) {
        e.preventDefault()

        if (!token) {
            navigate("/sign-in")
        } else {
            const userBody = {
                games: gamesInCartID,
                email,
            }

            const userConfig = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

            const promise = axios.post(URL, userBody, userConfig)

            promise.then((response) => {
                alert("Games bought and added into your account.")
                navigate("/")
            })
            promise.catch((e) => {
                alert("Something went wrong.")
                console.log(e)
            })
        }
    }

    return (
        <>
            <MainContainer>
                <OrderContainer>
                    <label>YOUR ORDER</label>

                    {gamesInCart.map((game) => {
                        const { title, price, images } = game
                        let discountedPrice

                        if (game.hasDiscount) {
                            discountedPrice =
                                game.price - game.price * game.discountAmount
                            totalPrice += discountedPrice
                            discountedPrice = discountedPrice.toFixed(2)
                        } else {
                            totalPrice += price
                        }
                        fixedPrice = totalPrice.toFixed(2)
                        return (
                            <GameContainer>
                                <img
                                    src={images.cover}
                                    alt={`${title} cover`}
                                />
                                <h6>{title}</h6>
                                <div>
                                    {game.hasDiscount ? (
                                        <h5
                                            style={{
                                                textDecoration: "line-through",
                                                color: "gray",
                                            }}
                                        >
                                            R$ {price}
                                        </h5>
                                    ) : (
                                        ""
                                    )}

                                    {game.hasDiscount ? (
                                        <h5>R$ {discountedPrice}</h5>
                                    ) : (
                                        <h5>R$ {price}</h5>
                                    )}
                                </div>
                            </GameContainer>
                        )
                    })}
                    <GameContainer style={{ justifyContent: "right" }}>
                        <h5 style={{ marginRight: "15px" }}>
                            ORDER TOTAL: R$ {fixedPrice}
                        </h5>
                    </GameContainer>
                </OrderContainer>

                <PaymentContainer>
                    <form onSubmit={buyGames}>
                        <ConfirmPayment>
                            <input required type="checkbox" />
                            <h5>
                                Confirm the products are correct and proceed
                            </h5>
                        </ConfirmPayment>
                        <FinishPayment>
                            <h3>R$ {fixedPrice}</h3>
                            <button>Check out now</button>
                        </FinishPayment>
                    </form>
                </PaymentContainer>
            </MainContainer>
        </>
    )
}

const MainContainer = styled.main`
    width: 100vw;
    height: 100vh;
    padding: 50px 0px 0px;
    background: #d9d9d9;
`

const OrderContainer = styled.section`
    width: 100%;
    margin-top: 20px;

    label {
        margin-left: 15px;
        font-weight: 600;
        font-size: 16px;
    }
`

const GameContainer = styled.div`
    width: 100%;
    height: 60px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: #e1e1e1;
    box-shadow: 0 1px 5px rgb(0 0 0 / 15%);

    :first-of-type {
        margin-top: 15px;
    }

    img {
        max-width: 100px;
        height: 60px;
        object-fit: cover;
    }

    h6 {
        margin: 0 20px 0 0;
        font-weight: 600;
        font-size: 14px;
    }

    h5 {
        margin: 0 5px;
        font-weight: 500;
        font-size: 12px;
    }

    div {
        display: flex;
        margin-right: 10px;
    }
`

const PaymentContainer = styled.section`
    width: 100%;
    margin-top: 40px;
    padding: 10px 20px 20px;

    background: #e1e1e1;
    box-shadow: 0 1px 5px rgb(0 0 0 / 15%);

    form {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    h5 {
        font-size: 12px;
        margin: 0 0 0 15px;
        font-weight: 600;
        color: gray;
    }
`

const ConfirmPayment = styled.div`
    display: flex;
    align-items: center;
`

const FinishPayment = styled.div`
    width: 100%
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    h3 {
        font-size: 18px;
    }

    button {
        width: 100%;
        height: 50px;
        border: 1px solid #96bd27;
        border-radius: 5px;
        border-bottom-color: #69941b;
        border-left-color: #7fa721;
        border-right-color: #7fa721;
        color: #fff;
        background-image: linear-gradient(-180deg, #9fbf00, #80ab00 91%);
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 25%);
        font-weight: bold;
    }
`
