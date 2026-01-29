package com.ssafy14.a606.domain.notice.dto.response;

import com.ssafy14.a606.domain.notice.entity.Home;
import lombok.Getter;

@Getter
public class HomeDto {

    private String address;
    private Double latitude;
    private Double longitude;

    public HomeDto(Home home) {
        this.address = home.getAddress();
        this.latitude = home.getLatitude();
        this.longitude = home.getLongitude();
    }
}
