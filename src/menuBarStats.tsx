import {
  Clipboard,
  Icon,
  LaunchType,
  LocalStorage,
  MenuBarExtra,
  Toast,
  launchCommand,
  open,
  showToast,
} from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import fetch from "node-fetch";
import { ActivatingDelta, ValidatorStats } from "./types";

export default function Command() {
  const { isLoading, data } = useCachedPromise(async () => {
    const selectedValidator = await LocalStorage.getItem<string>("validator").then((v) =>
      v
        ? (JSON.parse(v) as {
            address: string;
            name: string;
          })
        : null,
    );
    const response = await fetch(
      `https://api.stakewiz.com/validator/${selectedValidator?.address ?? "VotESBSkLKU8vebS6wTR2rzWWJsLc6YThYS6tebPxXq"}`,
    );
    const validatorData = await response.json();
    return validatorData as unknown as ValidatorStats;
  }, []);

  const { isLoading: isDeltaLoading, data: deltaData } = useCachedPromise(async () => {
    const selectedValidator = await LocalStorage.getItem<string>("validator").then((v) =>
      v
        ? (JSON.parse(v) as {
            address: string;
            name: string;
          })
        : null,
    );
    const response = await fetch(
      `https://api.stakewiz.com/validator_epoch_stake_accounts/${selectedValidator?.address ?? "VotESBSkLKU8vebS6wTR2rzWWJsLc6YThYS6tebPxXq"}`,
    );
    const validatorData = await response.json();
    return validatorData as unknown as ActivatingDelta;
  }, []);

  return (
    <MenuBarExtra title={isLoading ? data?.name ?? "Loading..." : data?.name} icon={data?.image} isLoading={isLoading}>
      {data && (
        <>
          <MenuBarExtra.Section title="General">
            <CopyItemWithToast
              icon={Icon.Trophy}
              title={`#${data?.rank.toString()}`}
              subtitle="Rank"
              onAction={() => Clipboard.copy(data?.rank.toString() ?? "")}
            />
            <CopyItemWithToast
              icon={Icon.HardDrive}
              title={`${data?.version}`}
              subtitle="Version"
              onAction={() => Clipboard.copy(data?.version.toString() ?? "")}
            />
            <CopyItemWithToast
              icon={Icon.Coins}
              title={`${data?.apy_estimate.toFixed(2)}%`}
              subtitle="APY"
              onAction={() => Clipboard.copy(data?.apy_estimate.toFixed(2) ?? "")}
            />
            <CopyItemWithToast
              icon={Icon.Weights}
              title={`${data?.activated_stake.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })} SOL`}
              subtitle="Stake"
              onAction={() => Clipboard.copy(data?.activated_stake.toString() ?? "")}
            />

            <MenuBarExtra.Submenu title={`Stake Change`}>
              <CopyItemWithToast
                title={`${((deltaData?.activating.amount ?? 0) - (deltaData?.deactivating.amount ?? 0)).toFixed(2)} SOL`}
                subtitle="Total Stake Change"
              />
              <MenuBarExtra.Separator />
              <CopyItemWithToast
                title={`${(deltaData?.activating.amount ?? 0).toFixed(2)} SOL`}
                subtitle="Activating Stake"
              />
              <CopyItemWithToast title={`${deltaData?.activating.count}`} subtitle="Activating Stake Accounts" />
              <CopyItemWithToast
                title={`${(deltaData?.deactivating.amount ?? 0).toFixed(2)} SOL`}
                subtitle="Deactivating Stake"
              />
              <CopyItemWithToast title={`${deltaData?.deactivating.count}`} subtitle="Activating Stake Accounts" />
            </MenuBarExtra.Submenu>
          </MenuBarExtra.Section>
          <MenuBarExtra.Section title="Performance">
            <CopyItemWithToast icon={Icon.Gauge} title={`${data?.skip_rate.toFixed(2)}%`} subtitle="Skip rate" />
            <CopyItemWithToast icon={Icon.Gauge} title={`${data?.uptime.toFixed(2)}%`} subtitle="Uptime (30d)" />
            <CopyItemWithToast icon={Icon.Gauge} title={`${data?.wiz_score.toFixed(2)}%`} subtitle="Score" />
            <CopyItemWithToast icon={Icon.Gauge} title={`${data?.credit_ratio.toFixed(2)}%`} subtitle="Voting Rate" />
            <CopyItemWithToast
              icon={Icon.Gauge}
              title={`${data?.vote_success.toFixed(2)}%`}
              subtitle="Voting Success Rate"
            />
          </MenuBarExtra.Section>
          <MenuBarExtra.Section title="Location">
            <MenuBarExtra.Item
              icon={Icon.Globe}
              title={`${data?.ip_city}, ${data?.ip_country}`}
              onAction={() => open(`https://www.google.com/maps/place/${data?.ip_city},+${data?.ip_country}`)}
            />
            <MenuBarExtra.Item
              icon={Icon.Network}
              title={`${data?.tpu_ip}, ${data?.ip_org}`}
              onAction={() => open(`https://ipinfo.io/${data?.tpu_ip}`)}
            />
            <MenuBarExtra.Submenu title="More Geo Info">
              <CopyItemWithToast title={`${data?.asn_concentration.toFixed(2)}%`} subtitle="ASN Concentration" />
              <CopyItemWithToast title={`${data?.city_concentration.toFixed(2)}%`} subtitle="City Concentration" />
              <CopyItemWithToast
                title={`${data?.asncity_concentration.toFixed(2)}%`}
                subtitle="ASN + City Concentration"
              />
              <CopyItemWithToast title={`${data?.tpu_ip_concentration.toFixed(2)}%`} subtitle="TPU IP Concentration" />
            </MenuBarExtra.Submenu>
          </MenuBarExtra.Section>
          <MenuBarExtra.Section title="Links">
            <MenuBarExtra.Item icon={Icon.Link} title={"Website"} onAction={() => open(data?.website ?? "")} />
          </MenuBarExtra.Section>
          <MenuBarExtra.Section>
            <MenuBarExtra.Item
              title={`Change Validator`}
              onAction={() => {
                launchCommand({ name: "changeValidator", type: LaunchType.UserInitiated });
              }}
            />
          </MenuBarExtra.Section>
          <MenuBarExtra.Section>
            <MenuBarExtra.Item title={`Powered by Stakewiz ❤️`} />
          </MenuBarExtra.Section>
        </>
      )}
    </MenuBarExtra>
  );
}

const CopyItemWithToast = (props: React.ComponentProps<typeof MenuBarExtra.Item>) => (
  <MenuBarExtra.Item
    {...props}
    onAction={() => {
      Clipboard.copy(props.title);
      showToast({
        title: `Copied ${props.subtitle} to clipboard`,
        message: props.title,
        style: Toast.Style.Success,
      });
    }}
  />
);
