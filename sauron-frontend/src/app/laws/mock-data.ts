// Types for laws data
export interface LawDefinition {
  id: string;
  term: string;
  description: string;
  examples: string[];
}

export interface StateLaw {
  id: string;
  title: string;
  description: string;
  details: string;
  citations: string[];
}

export interface StateGunLaws {
  state: string;
  stateCode: string;
  overviewText: string;
  lastUpdated: string;
  permitRequired: boolean;
  restrictedFeatures: string[];
  magazineLimit: number | null; // null means no limit
  otherRestrictions: string[];
  laws: StateLaw[];
}

// Gun law glossary
export const gunLawGlossary: LawDefinition[] = [
  {
    id: "assault-weapon",
    term: "Assault Weapon",
    description: "A legal definition that varies by jurisdiction, typically referring to semi-automatic firearms with specific features such as detachable magazines combined with certain other characteristics (pistol grips, folding stocks, etc.).",
    examples: [
      "California defines 'assault weapons' as semi-automatic centerfire rifles that accept detachable magazines and have any one of several specified features.",
      "New York's SAFE Act defines them as semi-automatic rifles with detachable magazines and at least one military-style feature."
    ]
  },
  {
    id: "magazine-capacity",
    term: "Magazine Capacity Restriction",
    description: "Laws limiting the maximum number of rounds a firearm magazine can hold.",
    examples: [
      "California restricts magazines to a maximum of 10 rounds.",
      "Colorado restricts magazines to a maximum of 15 rounds."
    ]
  },
  {
    id: "feature-test",
    term: "Feature Test",
    description: "A legal approach that classifies firearms based on the presence of specific physical features rather than their functional characteristics.",
    examples: [
      "Under many state laws, a pistol grip on a semi-automatic rifle may make it an 'assault weapon'.",
      "A threaded barrel capable of accepting a suppressor may be a restricted feature in some states."
    ]
  },
  {
    id: "fixed-magazine",
    term: "Fixed Magazine",
    description: "A magazine that cannot be removed without disassembling the firearm action.",
    examples: [
      "In California, rifles with fixed magazines (requiring 'bullet button' or similar) may be exempt from certain assault weapon restrictions.",
      "Some compliant AR-15 builds use fixed magazine systems to avoid feature restrictions."
    ]
  },
  {
    id: "featureless-build",
    term: "Featureless Build",
    description: "A firearm configuration designed to comply with state assault weapon laws by avoiding restricted features while maintaining a detachable magazine.",
    examples: [
      "A California compliant 'featureless' AR-15 typically has a stock without a pistol grip, no flash hider, and no adjustable stock.",
      "These builds allow for detachable magazines while remaining legal in restricted states."
    ]
  }
];

// Sample state laws
export const stateLaws: StateGunLaws[] = [
  {
    state: "California",
    stateCode: "CA",
    overviewText: "California has some of the most restrictive firearm laws in the United States, including assault weapon restrictions, magazine capacity limits, and background checks for ammunition purchases.",
    lastUpdated: "2023-06-15",
    permitRequired: true,
    restrictedFeatures: [
      "Pistol grips on rifles with detachable magazines",
      "Flash suppressors",
      "Folding/telescoping stocks",
      "Forward pistol grips",
      "Threaded barrels on pistols"
    ],
    magazineLimit: 10,
    otherRestrictions: [
      "Handgun roster (approved handguns only)",
      "Background checks required for all ammunition purchases",
      "Red flag laws",
      "10-day waiting period"
    ],
    laws: [
      {
        id: "ca-assault-weapons",
        title: "Assault Weapons Control Act",
        description: "Prohibits the sale, transfer, and possession of assault weapons as defined by state law.",
        details: "Under California law, an assault weapon is defined as a semiautomatic firearm with specific features. For rifles with detachable magazines, prohibited features include pistol grips, thumbhole stocks, folding/telescoping stocks, grenade/flare launchers, flash suppressors, and forward pistol grips.",
        citations: ["CA Penal Code § 30510", "CA Penal Code § 30515"]
      },
      {
        id: "ca-magazine-limit",
        title: "Large-Capacity Magazine Restriction",
        description: "Prohibits the possession, sale, transfer, or import of any large-capacity magazine (over 10 rounds).",
        details: "California prohibits the manufacture, importation, sale, transfer, and possession of any large-capacity magazine. A large-capacity magazine is defined as any ammunition feeding device that can accept more than 10 rounds.",
        citations: ["CA Penal Code § 32310"]
      }
    ]
  },
  {
    state: "Texas",
    stateCode: "TX",
    overviewText: "Texas has relatively permissive firearm laws with few restrictions on purchase, possession, or features. The state supports strong protection of Second Amendment rights.",
    lastUpdated: "2023-09-01",
    permitRequired: false,
    restrictedFeatures: [],
    magazineLimit: null,
    otherRestrictions: [
      "Federal background checks still apply",
      "Some municipal restrictions may exist"
    ],
    laws: [
      {
        id: "tx-carry",
        title: "Constitutional Carry",
        description: "Allows legal gun owners to carry handguns, openly or concealed, without a state-issued license.",
        details: "As of September 1, 2021, Texas law allows persons 21 and older who can legally possess firearms under federal and Texas law to carry a handgun in public without a License to Carry (LTC). Certain restrictions on locations where carrying is prohibited still apply.",
        citations: ["TX HB 1927 (87th Legislature)", "TX Penal Code § 46.02"]
      },
      {
        id: "tx-preemption",
        title: "State Preemption",
        description: "State law generally preempts local regulation of firearms.",
        details: "Texas state law prevents most local governments from regulating firearms more strictly than state law, with some exceptions for property owned or leased by the municipality or county.",
        citations: ["TX Local Government Code § 229.001", "TX Local Government Code § 236.002"]
      }
    ]
  },
  {
    state: "New York",
    stateCode: "NY",
    overviewText: "New York enforces strict gun control measures including an assault weapons ban, magazine capacity restrictions, and comprehensive background checks.",
    lastUpdated: "2023-05-20",
    permitRequired: true,
    restrictedFeatures: [
      "Pistol grips on rifles with detachable magazines",
      "Thumbhole stocks",
      "Folding/telescoping stocks",
      "Second handgrips",
      "Barrel shrouds",
      "Threaded barrels",
      "Muzzle brakes/compensators"
    ],
    magazineLimit: 10,
    otherRestrictions: [
      "Background checks for all gun sales including private sales",
      "License required for handgun purchase",
      "Safe storage requirements",
      "Red flag laws"
    ],
    laws: [
      {
        id: "ny-safe-act",
        title: "NY SAFE Act",
        description: "Comprehensive gun regulation law that broadened the definition of assault weapons and implemented other restrictions.",
        details: "The NY SAFE Act expanded the definition of assault weapons to include semi-automatic rifles with detachable magazines that have one prohibited feature (previously required two features). It also established background checks for ammunition sales, created a registry of assault weapons, and implemented stronger regulations for gun storage.",
        citations: ["NY Penal Law § 265.00", "2013 NY Senate-Assembly Bill S2230"]
      },
      {
        id: "ny-magazine-limit",
        title: "Magazine Capacity Restriction",
        description: "Limits magazines to a maximum capacity of 10 rounds.",
        details: "New York prohibits the possession of ammunition feeding devices with capacities exceeding 10 rounds, regardless of when they were manufactured or their date of acquisition.",
        citations: ["NY Penal Law § 265.36", "NY Penal Law § 265.37"]
      }
    ]
  }
];

// Federal laws
export const federalLaws = {
  overviewText: "Federal firearms laws establish minimum nationwide standards for firearm regulation in the United States, while states may implement stricter regulations.",
  lastUpdated: "2023-04-10",
  laws: [
    {
      id: "gca-1968",
      title: "Gun Control Act of 1968",
      description: "Regulates interstate commerce in firearms and prohibits certain categories of individuals from purchasing or possessing firearms.",
      details: "The GCA imposes requirements for interstate firearm transfers through licensed dealers, prohibits mail-order rifle sales, and establishes categories of prohibited persons who cannot legally possess firearms, including convicted felons, fugitives, persons adjudicated mentally defective, illegal aliens, dishonorably discharged veterans, and persons convicted of domestic violence misdemeanors.",
      citations: ["18 U.S.C. § 921 et seq."]
    },
    {
      id: "nfa-1934",
      title: "National Firearms Act",
      description: "Regulates and taxes the manufacture and transfer of certain firearms and devices.",
      details: "The NFA imposed a tax on the manufacture and transfer of specific firearms and mandated their registration, including short-barreled rifles (barrels under 16 inches), short-barreled shotguns (barrels under 18 inches), machine guns, suppressors, destructive devices, and 'any other weapons' as defined by the law.",
      citations: ["26 U.S.C. § 5801 et seq."]
    },
    {
      id: "fopa-1986",
      title: "Firearm Owners Protection Act",
      description: "Revised portions of the Gun Control Act to protect gun owners' rights while continuing to regulate firearms.",
      details: "FOPA prohibited the federal government from establishing a national firearms registry, limited ATF inspections of dealers, allowed interstate sales of long guns through dealers, and legalized the transportation of unloaded, locked firearms across state lines regardless of local laws. It also prohibited civilian ownership of machine guns manufactured after May 19, 1986.",
      citations: ["18 U.S.C. § 921 et seq. (as amended)"]
    },
    {
      id: "brady-act",
      title: "Brady Handgun Violence Prevention Act",
      description: "Mandated federal background checks on firearm purchasers.",
      details: "The Brady Act instituted the National Instant Criminal Background Check System (NICS) to prevent prohibited persons from purchasing firearms. Licensed dealers must check the NICS database before completing a sale.",
      citations: ["18 U.S.C. § 922(t)"]
    }
  ]
}; 