pragma solidity >= 0.4.24;
pragma experimental ABIEncoderV2;

contract ImageContract {
    Image[] public Images;

    uint256 public ImagesCount;

    struct Image {
        string _idUser;
        string _hashImage;
    }

    function addImage(string memory _idUser, string memory _hashImage) public {
        Images.push(Image(_idUser, _hashImage));
        ImagesCount += 1;
    }

    function getImage() public view returns(Image[] memory){
        return Images;
    }
}