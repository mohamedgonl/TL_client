<GameFile>
  <PropertyGroup Name="TroopTrainPopup" Type="Node" ID="3db1347a-fa68-4039-a0c3-8720855dcb45" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Node" Tag="92" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="Panel_1" ActionTag="554110726" VisibleForFrame="False" Tag="249" IconVisible="False" LeftMargin="-568.0000" RightMargin="-568.0000" TopMargin="-320.0000" BottomMargin="-320.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" ctype="PanelObjectData">
            <Size X="1136.0000" Y="640.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <SingleColor A="255" R="150" G="200" B="255" />
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
              <AbstractNodeData Name="button_next" ActionTag="-1916268795" Tag="95" IconVisible="False" LeftMargin="184.3000" RightMargin="-233.3000" TopMargin="-56.0000" BottomMargin="-56.0000" ctype="SpriteObjectData">
                <Size X="49.0000" Y="112.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="208.8000" />
                <Scale ScaleX="0.7500" ScaleY="0.7000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="guis/train_troop_gui/forward.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="button_prev" ActionTag="-718687549" Tag="96" IconVisible="False" LeftMargin="-233.5000" RightMargin="184.5000" TopMargin="-56.0000" BottomMargin="-56.0000" ctype="SpriteObjectData">
                <Size X="49.0000" Y="112.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-209.0000" />
                <Scale ScaleX="0.7500" ScaleY="0.7000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="guis/train_troop_gui/previous.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="train_info" ActionTag="-1421108102" Tag="300" IconVisible="True" LeftMargin="-83.0000" RightMargin="83.0000" TopMargin="-44.0000" BottomMargin="44.0000" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <Children>
                  <AbstractNodeData Name="queue_image" ActionTag="1521505156" Tag="97" IconVisible="False" LeftMargin="-204.0000" RightMargin="-204.0000" TopMargin="-27.0000" BottomMargin="-27.0000" ctype="SpriteObjectData">
                    <Size X="408.0000" Y="54.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position />
                    <Scale ScaleX="0.5557" ScaleY="0.6814" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="guis/train_troop_gui/queue.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="troop_training" ActionTag="1918524041" Tag="325" IconVisible="False" LeftMargin="115.5000" RightMargin="-173.5000" TopMargin="-29.1623" BottomMargin="-28.8377" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="28" Scale9Height="36" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="58.0000" Y="58.0000" />
                    <Children>
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
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="144.5000" Y="0.1623" />
                    <Scale ScaleX="0.7500" ScaleY="0.7500" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                    <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                    <NormalFileData Type="Normal" Path="guis/train_troop_gui/small_icon/slot.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="troop_count_after_train_string" ActionTag="-2035921844" Tag="323" IconVisible="False" LeftMargin="-143.0000" RightMargin="-143.0000" TopMargin="15.5000" BottomMargin="-34.5000" LabelText="Tổng số quân sau huấn luyện: 105/80" ctype="TextBMFontObjectData">
                    <Size X="286.0000" Y="19.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position Y="-25.0000" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="-83.0000" Y="44.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="time_info" ActionTag="-695148732" Tag="298" IconVisible="True" LeftMargin="135.3079" RightMargin="-135.3079" TopMargin="-58.1020" BottomMargin="58.1020" ctype="SingleNodeObjectData">
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
                      <AbstractNodeData Name="done_now_price_icon" ActionTag="1277779497" Tag="303" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="88.9000" RightMargin="9.1000" TopMargin="11.5024" BottomMargin="11.4976" LeftEage="10" RightEage="10" TopEage="9" BottomEage="9" Scale9OriginX="10" Scale9OriginY="9" Scale9Width="12" Scale9Height="11" ctype="ImageViewObjectData">
                        <Size X="32.0000" Y="29.0000" />
                        <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                        <Position X="120.9000" Y="25.9976" />
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
                <Position X="135.3079" Y="58.1020" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="list_troop_container" ActionTag="-574558814" Tag="301" IconVisible="True" LeftMargin="-48.7242" RightMargin="48.7242" TopMargin="43.2483" BottomMargin="-43.2483" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <Children>
                  <AbstractNodeData Name="panel11" ActionTag="1259924322" Alpha="0" Tag="257" IconVisible="False" LeftMargin="-100.0000" RightMargin="-100.0000" TopMargin="-111.5000" BottomMargin="-111.5000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" ctype="PanelObjectData">
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
                  <AbstractNodeData Name="troop_item" ActionTag="-1119458435" Tag="98" IconVisible="False" LeftMargin="-141.0003" RightMargin="29.0003" TopMargin="-55.4995" BottomMargin="-55.5005" ctype="SpriteObjectData">
                    <Size X="112.0000" Y="111.0000" />
                    <Children>
                      <AbstractNodeData Name="troop_image" ActionTag="2075212610" Tag="256" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="9.0000" RightMargin="9.0000" TopMargin="6.7800" BottomMargin="11.2200" LeftEage="31" RightEage="31" TopEage="30" BottomEage="30" Scale9OriginX="31" Scale9OriginY="30" Scale9Width="32" Scale9Height="33" ctype="ImageViewObjectData">
                        <Size X="94.0000" Y="93.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="56.0000" Y="57.7200" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5200" />
                        <PreSize X="0.8393" Y="0.8378" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/icon/ARM_1.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="button_info" ActionTag="-1497009149" Tag="100" IconVisible="False" LeftMargin="71.8000" RightMargin="3.2000" TopMargin="0.2800" BottomMargin="73.7200" ctype="SpriteObjectData">
                        <Size X="37.0000" Y="37.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="90.3000" Y="92.2200" />
                        <Scale ScaleX="0.7500" ScaleY="0.7500" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.8063" Y="0.8308" />
                        <PreSize X="0.3304" Y="0.3333" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/info.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="cost_container" ActionTag="1975983101" Tag="251" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="8.5000" RightMargin="8.5000" TopMargin="77.3000" BottomMargin="10.7000" ctype="SpriteObjectData">
                        <Size X="95.0000" Y="23.0000" />
                        <Children>
                          <AbstractNodeData Name="cost" ActionTag="900394600" Tag="254" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="33.5000" RightMargin="33.5000" TopMargin="2.0000" BottomMargin="2.0000" LabelText="25" ctype="TextBMFontObjectData">
                            <Size X="28.0000" Y="19.0000" />
                            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                            <Position X="47.5000" Y="11.5000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="0.5000" Y="0.5000" />
                            <PreSize X="0.2947" Y="0.8261" />
                            <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                          </AbstractNodeData>
                          <AbstractNodeData Name="price_icon" ActionTag="1586290540" Tag="273" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="79.0000" TopMargin="1.5000" BottomMargin="1.5000" LeftEage="5" RightEage="5" TopEage="6" BottomEage="6" Scale9OriginX="5" Scale9OriginY="6" Scale9Width="6" Scale9Height="8" ctype="ImageViewObjectData">
                            <Size X="16.0000" Y="20.0000" />
                            <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                            <Position X="95.0000" Y="11.5000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="1.0000" Y="0.5000" />
                            <PreSize X="0.1684" Y="0.8696" />
                            <FileData Type="Normal" Path="guis/train_troop_gui/icon_elixir.png" Plist="" />
                          </AbstractNodeData>
                        </Children>
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="56.0000" Y="22.2000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.2000" />
                        <PreSize X="0.8482" Y="0.2072" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/bg_cost.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="-85.0003" Y="-0.0005" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="guis/train_troop_gui/slot.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="troop_item_0" ActionTag="2056773469" Tag="304" IconVisible="False" LeftMargin="-79.6669" RightMargin="-32.3331" TopMargin="-55.5000" BottomMargin="-55.5000" ctype="SpriteObjectData">
                    <Size X="112.0000" Y="111.0000" />
                    <Children>
                      <AbstractNodeData Name="troop_image" ActionTag="-2119064581" Tag="305" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="9.0000" RightMargin="9.0000" TopMargin="6.7800" BottomMargin="11.2200" LeftEage="31" RightEage="31" TopEage="30" BottomEage="30" Scale9OriginX="31" Scale9OriginY="30" Scale9Width="32" Scale9Height="33" ctype="ImageViewObjectData">
                        <Size X="94.0000" Y="93.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="56.0000" Y="57.7200" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5200" />
                        <PreSize X="0.8393" Y="0.8378" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/icon/ARM_1.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="button_info" ActionTag="1883573404" Tag="306" IconVisible="False" LeftMargin="71.8000" RightMargin="3.2000" TopMargin="0.2800" BottomMargin="73.7200" ctype="SpriteObjectData">
                        <Size X="37.0000" Y="37.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="90.3000" Y="92.2200" />
                        <Scale ScaleX="0.7500" ScaleY="0.7500" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.8063" Y="0.8308" />
                        <PreSize X="0.3304" Y="0.3333" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/info.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="cost_container" ActionTag="1914183375" Tag="307" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="8.5000" RightMargin="8.5000" TopMargin="77.3000" BottomMargin="10.7000" ctype="SpriteObjectData">
                        <Size X="95.0000" Y="23.0000" />
                        <Children>
                          <AbstractNodeData Name="cost" ActionTag="1879379707" Tag="308" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="33.5000" RightMargin="33.5000" TopMargin="2.0000" BottomMargin="2.0000" LabelText="25" ctype="TextBMFontObjectData">
                            <Size X="28.0000" Y="19.0000" />
                            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                            <Position X="47.5000" Y="11.5000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="0.5000" Y="0.5000" />
                            <PreSize X="0.2947" Y="0.8261" />
                            <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                          </AbstractNodeData>
                          <AbstractNodeData Name="price_icon" ActionTag="1709283163" Tag="309" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="79.0000" TopMargin="1.5000" BottomMargin="1.5000" LeftEage="5" RightEage="5" TopEage="6" BottomEage="6" Scale9OriginX="5" Scale9OriginY="6" Scale9Width="6" Scale9Height="8" ctype="ImageViewObjectData">
                            <Size X="16.0000" Y="20.0000" />
                            <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                            <Position X="95.0000" Y="11.5000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="1.0000" Y="0.5000" />
                            <PreSize X="0.1684" Y="0.8696" />
                            <FileData Type="Normal" Path="guis/train_troop_gui/icon_elixir.png" Plist="" />
                          </AbstractNodeData>
                        </Children>
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="56.0000" Y="22.2000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.2000" />
                        <PreSize X="0.8482" Y="0.2072" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/bg_cost.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="-23.6669" Y="0.0000" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="guis/train_troop_gui/slot.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="troop_item_1" ActionTag="1363644949" Tag="310" IconVisible="False" LeftMargin="-18.3334" RightMargin="-93.6666" TopMargin="-55.5000" BottomMargin="-55.5000" ctype="SpriteObjectData">
                    <Size X="112.0000" Y="111.0000" />
                    <Children>
                      <AbstractNodeData Name="troop_image" ActionTag="-579305432" Tag="311" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="9.0000" RightMargin="9.0000" TopMargin="6.7800" BottomMargin="11.2200" LeftEage="31" RightEage="31" TopEage="30" BottomEage="30" Scale9OriginX="31" Scale9OriginY="30" Scale9Width="32" Scale9Height="33" ctype="ImageViewObjectData">
                        <Size X="94.0000" Y="93.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="56.0000" Y="57.7200" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5200" />
                        <PreSize X="0.8393" Y="0.8378" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/icon/ARM_1.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="button_info" ActionTag="2081847040" Tag="312" IconVisible="False" LeftMargin="71.8000" RightMargin="3.2000" TopMargin="0.2800" BottomMargin="73.7200" ctype="SpriteObjectData">
                        <Size X="37.0000" Y="37.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="90.3000" Y="92.2200" />
                        <Scale ScaleX="0.7500" ScaleY="0.7500" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.8063" Y="0.8308" />
                        <PreSize X="0.3304" Y="0.3333" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/info.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="cost_container" ActionTag="-1416791217" Tag="313" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="8.5000" RightMargin="8.5000" TopMargin="77.3000" BottomMargin="10.7000" ctype="SpriteObjectData">
                        <Size X="95.0000" Y="23.0000" />
                        <Children>
                          <AbstractNodeData Name="cost" ActionTag="507179629" Tag="314" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="33.5000" RightMargin="33.5000" TopMargin="2.0000" BottomMargin="2.0000" LabelText="25" ctype="TextBMFontObjectData">
                            <Size X="28.0000" Y="19.0000" />
                            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                            <Position X="47.5000" Y="11.5000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="0.5000" Y="0.5000" />
                            <PreSize X="0.2947" Y="0.8261" />
                            <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                          </AbstractNodeData>
                          <AbstractNodeData Name="price_icon" ActionTag="323954088" Tag="315" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="79.0000" TopMargin="1.5000" BottomMargin="1.5000" LeftEage="5" RightEage="5" TopEage="6" BottomEage="6" Scale9OriginX="5" Scale9OriginY="6" Scale9Width="6" Scale9Height="8" ctype="ImageViewObjectData">
                            <Size X="16.0000" Y="20.0000" />
                            <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                            <Position X="95.0000" Y="11.5000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="1.0000" Y="0.5000" />
                            <PreSize X="0.1684" Y="0.8696" />
                            <FileData Type="Normal" Path="guis/train_troop_gui/icon_elixir.png" Plist="" />
                          </AbstractNodeData>
                        </Children>
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="56.0000" Y="22.2000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.2000" />
                        <PreSize X="0.8482" Y="0.2072" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/bg_cost.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="37.6666" Y="0.0000" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="guis/train_troop_gui/slot.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="troop_item_2" ActionTag="-835458592" Tag="316" IconVisible="False" LeftMargin="43.0000" RightMargin="-155.0000" TopMargin="-55.5000" BottomMargin="-55.5000" ctype="SpriteObjectData">
                    <Size X="112.0000" Y="111.0000" />
                    <Children>
                      <AbstractNodeData Name="troop_image" ActionTag="-1695475464" Tag="317" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="9.0000" RightMargin="9.0000" TopMargin="6.7800" BottomMargin="11.2200" LeftEage="31" RightEage="31" TopEage="30" BottomEage="30" Scale9OriginX="31" Scale9OriginY="30" Scale9Width="32" Scale9Height="33" ctype="ImageViewObjectData">
                        <Size X="94.0000" Y="93.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="56.0000" Y="57.7200" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5200" />
                        <PreSize X="0.8393" Y="0.8378" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/icon/ARM_1.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="button_info" ActionTag="-1505077820" Tag="318" IconVisible="False" LeftMargin="71.8000" RightMargin="3.2000" TopMargin="0.2800" BottomMargin="73.7200" ctype="SpriteObjectData">
                        <Size X="37.0000" Y="37.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="90.3000" Y="92.2200" />
                        <Scale ScaleX="0.7500" ScaleY="0.7500" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.8063" Y="0.8308" />
                        <PreSize X="0.3304" Y="0.3333" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/info.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="cost_container" ActionTag="-848732458" Tag="319" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="8.5000" RightMargin="8.5000" TopMargin="77.3000" BottomMargin="10.7000" ctype="SpriteObjectData">
                        <Size X="95.0000" Y="23.0000" />
                        <Children>
                          <AbstractNodeData Name="cost" ActionTag="-541660340" Tag="320" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="33.5000" RightMargin="33.5000" TopMargin="2.0000" BottomMargin="2.0000" LabelText="25" ctype="TextBMFontObjectData">
                            <Size X="28.0000" Y="19.0000" />
                            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                            <Position X="47.5000" Y="11.5000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="0.5000" Y="0.5000" />
                            <PreSize X="0.2947" Y="0.8261" />
                            <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                          </AbstractNodeData>
                          <AbstractNodeData Name="price_icon" ActionTag="-1390103016" Tag="321" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="79.0000" TopMargin="1.5000" BottomMargin="1.5000" LeftEage="5" RightEage="5" TopEage="6" BottomEage="6" Scale9OriginX="5" Scale9OriginY="6" Scale9Width="6" Scale9Height="8" ctype="ImageViewObjectData">
                            <Size X="16.0000" Y="20.0000" />
                            <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                            <Position X="95.0000" Y="11.5000" />
                            <Scale ScaleX="1.0000" ScaleY="1.0000" />
                            <CColor A="255" R="255" G="255" B="255" />
                            <PrePosition X="1.0000" Y="0.5000" />
                            <PreSize X="0.1684" Y="0.8696" />
                            <FileData Type="Normal" Path="guis/train_troop_gui/icon_elixir.png" Plist="" />
                          </AbstractNodeData>
                        </Children>
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="56.0000" Y="22.2000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.2000" />
                        <PreSize X="0.8482" Y="0.2072" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/bg_cost.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="99.0000" Y="0.0000" />
                    <Scale ScaleX="0.5000" ScaleY="0.5000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="guis/train_troop_gui/slot.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
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
          <AbstractNodeData Name="troop_count" ActionTag="2057417277" Tag="322" IconVisible="False" LeftMargin="39.8911" RightMargin="-67.8911" TopMargin="-67.7742" BottomMargin="48.7742" LabelText="x3" ctype="TextBMFontObjectData">
            <Size X="28.0000" Y="19.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="53.8911" Y="58.2742" />
            <Scale ScaleX="0.8000" ScaleY="0.8000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>