<GameFile>
  <PropertyGroup Name="TroopTrainPopup" Type="Node" ID="3db1347a-fa68-4039-a0c3-8720855dcb45" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Node" Tag="92" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="Panel_1" ActionTag="554110726" Tag="249" IconVisible="False" LeftMargin="-568.0000" RightMargin="-568.0000" TopMargin="-320.0000" BottomMargin="-320.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1136.0000" Y="640.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <SingleColor A="255" R="80" G="80" B="80" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="train_popup" ActionTag="-98944622" Tag="299" IconVisible="True" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="bg" ActionTag="2122758598" Tag="93" IconVisible="False" LeftMargin="-195.5000" RightMargin="-195.5000" TopMargin="-136.5000" BottomMargin="-136.5000" ctype="SpriteObjectData">
                <Size X="391.0000" Y="273.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="guis/train_troop_gui/background.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="title" ActionTag="1082237277" Tag="94" IconVisible="False" LeftMargin="-66.0000" RightMargin="-66.0000" TopMargin="-127.5300" BottomMargin="108.5300" LabelText="Nhà lính 3 (1/30)" ctype="TextBMFontObjectData">
                <Size X="132.0000" Y="19.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position Y="118.0300" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="button_next" ActionTag="1305401182" UserData="-press_action" Tag="175" IconVisible="False" LeftMargin="184.3000" RightMargin="-233.3000" TopMargin="-56.0000" BottomMargin="-56.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="19" Scale9Height="90" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="49.0000" Y="112.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="208.8000" />
                <Scale ScaleX="0.7500" ScaleY="0.7000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Normal" Path="guis/train_troop_gui/forward.png" Plist="" />
                <NormalFileData Type="Normal" Path="guis/train_troop_gui/forward.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="button_prev" ActionTag="1778868432" UserData="-press_action" Tag="168" IconVisible="False" LeftMargin="-235.5000" RightMargin="186.5000" TopMargin="-56.0000" BottomMargin="-56.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="19" Scale9Height="90" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="49.0000" Y="112.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-211.0000" />
                <Scale ScaleX="0.7500" ScaleY="0.7000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Normal" Path="guis/train_troop_gui/previous.png" Plist="" />
                <NormalFileData Type="Normal" Path="guis/train_troop_gui/previous.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="train_info" ActionTag="-1421108102" Tag="300" IconVisible="True" LeftMargin="-82.0000" RightMargin="82.0000" TopMargin="-53.0000" BottomMargin="53.0000" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <Children>
                  <AbstractNodeData Name="queue_image" ActionTag="1521505156" Tag="97" IconVisible="False" LeftMargin="-183.0000" RightMargin="-225.0000" TopMargin="-27.0000" BottomMargin="-27.0000" ctype="SpriteObjectData">
                    <Size X="408.0000" Y="54.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="21.0000" Y="0.0000" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="guis/train_troop_gui/queue.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="troop_training" ActionTag="1918524041" UserData="-press_action" Tag="325" IconVisible="False" LeftMargin="115.5000" RightMargin="-173.5000" TopMargin="-29.1623" BottomMargin="-28.8377" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="28" Scale9Height="36" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="58.0000" Y="58.0000" />
                    <Children>
                      <AbstractNodeData Name="troop_icon" ActionTag="667201856" Tag="151" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" ctype="SpriteObjectData">
                        <Size X="58.0000" Y="58.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="29.0000" Y="29.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="1.0000" Y="1.0000" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/small_icon/ARM_1.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="button_cancle" ActionTag="1107593046" Tag="324" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="35.1000" RightMargin="-17.1000" TopMargin="-17.1000" BottomMargin="35.1000" ctype="SpriteObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="55.1000" Y="55.1000" />
                        <Scale ScaleX="0.7000" ScaleY="0.7000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.9500" Y="0.9500" />
                        <PreSize X="0.6897" Y="0.6897" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/cancel.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="troop_count" ActionTag="2057417277" UserData="-press-action" Tag="322" IconVisible="False" LeftMargin="1.0000" RightMargin="29.0000" TopMargin="0.5000" BottomMargin="38.5000" LabelText="x3" ctype="TextBMFontObjectData">
                        <Size X="28.0000" Y="19.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="15.0000" Y="48.0000" />
                        <Scale ScaleX="0.8000" ScaleY="0.8000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.2586" Y="0.8276" />
                        <PreSize X="0.4828" Y="0.3276" />
                        <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="training_process_bg" ActionTag="-131027206" Tag="166" IconVisible="False" PositionPercentXEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" LeftMargin="-5.8000" RightMargin="-5.8000" TopMargin="57.5000" BottomMargin="-18.5000" ProgressInfo="100" ctype="LoadingBarObjectData">
                        <Size X="69.6000" Y="19.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="29.0000" Y="-9.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="-0.1552" />
                        <PreSize X="1.2000" Y="0.3276" />
                        <ImageFileData Type="Normal" Path="guis/train_troop_gui/bg_train_bar.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="troop_trainning_process_bar" ActionTag="225048294" Tag="164" IconVisible="False" PositionPercentXEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" LeftMargin="-5.8000" RightMargin="-5.8000" TopMargin="57.5000" BottomMargin="-18.5000" ProgressInfo="97" ctype="LoadingBarObjectData">
                        <Size X="69.6000" Y="19.0000" />
                        <Children>
                          <AbstractNodeData Name="current_troop_remain_time_string" ActionTag="1158422789" Tag="165" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="19.3000" RightMargin="19.3000" TopMargin="3.5000" BottomMargin="-3.5000" LabelText="0s" ctype="TextBMFontObjectData">
                            <Size X="31.0000" Y="19.0000" />
                            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                            <Position X="34.8000" Y="6.0000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="0.5000" Y="0.3158" />
                            <PreSize X="0.4454" Y="1.0000" />
                            <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                          </AbstractNodeData>
                        </Children>
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="29.0000" Y="-9.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="-0.1552" />
                        <PreSize X="1.2000" Y="0.3276" />
                        <ImageFileData Type="Normal" Path="guis/train_troop_gui/train_bar.png" Plist="" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="144.5000" Y="0.1623" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <NormalFileData Type="Normal" Path="guis/train_troop_gui/small_icon/slot.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="troop_count_after_train_string" ActionTag="-2035921844" Tag="323" IconVisible="False" LeftMargin="-113.0000" RightMargin="-173.0000" TopMargin="15.5000" BottomMargin="-34.5000" LabelText="Tổng số quân sau huấn luyện: 105/80" ctype="TextBMFontObjectData">
                    <Size X="286.0000" Y="19.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="30.0000" Y="-25.0000" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="troop_waiting" ActionTag="-1399806060" UserData="-press_action" Tag="152" IconVisible="False" LeftMargin="55.0000" RightMargin="-113.0000" TopMargin="-29.0000" BottomMargin="-29.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="28" Scale9Height="36" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="58.0000" Y="58.0000" />
                    <Children>
                      <AbstractNodeData Name="troop_icon" ActionTag="1616512603" Tag="153" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" ctype="SpriteObjectData">
                        <Size X="58.0000" Y="58.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="29.0000" Y="29.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="1.0000" Y="1.0000" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/small_icon/ARM_1.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="button_cancle" ActionTag="1656183569" Tag="154" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="35.1000" RightMargin="-17.1000" TopMargin="-17.1000" BottomMargin="35.1000" ctype="SpriteObjectData">
                        <Size X="40.0000" Y="40.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="55.1000" Y="55.1000" />
                        <Scale ScaleX="0.7000" ScaleY="0.7000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.9500" Y="0.9500" />
                        <PreSize X="0.6897" Y="0.6897" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/cancel.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="troop_count" ActionTag="-1443364016" UserData="-press-action" Tag="155" IconVisible="False" LeftMargin="1.0000" RightMargin="29.0000" TopMargin="0.5000" BottomMargin="38.5000" LabelText="x3" ctype="TextBMFontObjectData">
                        <Size X="28.0000" Y="19.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="15.0000" Y="48.0000" />
                        <Scale ScaleX="0.8000" ScaleY="0.8000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.2586" Y="0.8276" />
                        <PreSize X="0.4828" Y="0.3276" />
                        <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="84.0000" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <NormalFileData Type="Normal" Path="guis/train_troop_gui/small_icon/slot.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="-82.0000" Y="53.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="time_info" ActionTag="-695148732" Tag="298" IconVisible="True" LeftMargin="135.3079" RightMargin="-135.3079" TopMargin="-63.1000" BottomMargin="63.1000" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <Children>
                  <AbstractNodeData Name="total_time_title" ActionTag="-2001688670" Tag="293" IconVisible="False" LeftMargin="-57.5000" RightMargin="-57.5000" TopMargin="-29.5000" BottomMargin="10.5000" LabelText="Tổng thời gian:" ctype="TextBMFontObjectData">
                    <Size X="115.0000" Y="19.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position Y="20.0000" />
                    <Scale ScaleX="0.6000" ScaleY="0.6000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="total_time_string" ActionTag="1563674436" Tag="295" IconVisible="False" LeftMargin="-18.5000" RightMargin="-18.5000" TopMargin="-12.5000" BottomMargin="-12.5000" LabelText="0s" ctype="TextBMFontObjectData">
                    <Size X="37.0000" Y="25.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_16.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="done_now_title" ActionTag="544337236" Tag="296" IconVisible="False" LeftMargin="-69.0000" RightMargin="-69.0000" TopMargin="10.5000" BottomMargin="-29.5000" LabelText="Hoàn thành ngay:" ctype="TextBMFontObjectData">
                    <Size X="138.0000" Y="19.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position Y="-20.0000" />
                    <Scale ScaleX="0.6000" ScaleY="0.6000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="done_now_button" ActionTag="-789916389" Tag="297" IconVisible="False" LeftMargin="-65.0000" RightMargin="-65.0000" TopMargin="14.0000" BottomMargin="-66.0000" ctype="SpriteObjectData">
                    <Size X="130.0000" Y="52.0000" />
                    <Children>
                      <AbstractNodeData Name="done_now_price" ActionTag="1302637153" Tag="302" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="53.5000" RightMargin="53.5000" TopMargin="16.5000" BottomMargin="16.5000" LabelText="0" ctype="TextBMFontObjectData">
                        <Size X="23.0000" Y="19.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="65.0000" Y="26.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.1769" Y="0.3654" />
                        <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="done_now_price_icon" ActionTag="1277779497" Tag="303" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="88.9000" RightMargin="9.1000" TopMargin="11.5000" BottomMargin="11.5000" LeftEage="10" RightEage="10" TopEage="9" BottomEage="9" Scale9OriginX="10" Scale9OriginY="9" Scale9Width="12" Scale9Height="11" ctype="ImageViewObjectData">
                        <Size X="32.0000" Y="29.0000" />
                        <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                        <Position X="120.9000" Y="26.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.9300" Y="0.5000" />
                        <PreSize X="0.2462" Y="0.5577" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/g_icon.png" Plist="" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position Y="-40.0000" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="guis/train_troop_gui/button.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="135.3079" Y="63.1000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="list_troop_container" ActionTag="-574558814" Tag="301" IconVisible="True" LeftMargin="-48.7242" RightMargin="48.7242" TopMargin="43.2483" BottomMargin="-43.2483" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <Children>
                  <AbstractNodeData Name="panel11" ActionTag="1259924322" Alpha="0" Tag="257" IconVisible="False" LeftMargin="-100.0000" RightMargin="-100.0000" TopMargin="-111.5000" BottomMargin="-111.5000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                    <Size X="200.0000" Y="223.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position />
                    <Scale ScaleX="1.7625" ScaleY="0.2819" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="-48.7242" Y="-43.2483" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>