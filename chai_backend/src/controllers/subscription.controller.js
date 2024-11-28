import { asyncHandler } from "../util/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiResponse} from "../util/ApiResponse.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(400, "Please provide valid channel id")
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new ApiError(400, "Channel does not exist")
    }

    Subscription.create(
        {
            subscriber: req.user?._id,
            channel: channelId
        })

        res
        .status(201)
        .json(new ApiResponse(200, "Subscribed"))

})

export {toggleSubscription} 